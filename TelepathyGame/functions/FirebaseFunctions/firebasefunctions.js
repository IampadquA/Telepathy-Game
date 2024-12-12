const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { data } = require("autoprefixer");


if (admin.apps.length === 0){
    admin.initializeApp();
}

const db = admin.firestore();


exports.getAllPlayerIds = functions.https.onCall(async (data, context) => {
    try {
      const userSnapshot = await db.collection('users').get();
      const userIds = userSnapshot.docs.map((doc) => doc.data().id);
      return userIds;
    } catch (error) {
      console.error('Error getting all player IDs:', error);
      throw new functions.https.HttpsError('unknown', 'Error getting all player IDs');
    }
});

exports.getInventory = functions.https.onCall(async (data, context) => {
    try {
      const { inventoryId, inventoryName } = data;
      const inventoryDocRef = db.collection('Inventorys').doc(inventoryId);
      const inventoryCollection = inventoryDocRef.collection(inventoryName);
      const inventorySnapshot = await inventoryCollection.get();
      const inventory = inventorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return inventory;
    } catch (error) {
      console.error('Error getting inventory:', error);
      throw new functions.https.HttpsError('unknown', 'Error getting inventory');
    }
  });

exports.sendInvite = functions.https.onCall(async (data, context) => {
    const {receiverUid} = data;

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to send invites.');
    }

    if (!receiverUid){
        throw new functions.https.HttpsError('invalid-argument', "Receiver player not found | Uid is null");
    }

    senderUid = context.auth.uid;

    try {

        // Extra check might be removed if its not necesery
        const [senderDoc, receiverDoc] = await Promise.all([
            db.collection('users').doc(senderUid).get(),
            db.collection('users').doc(receiverUid).get()
        ]);

        if (!senderDoc.exists || !receiverDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Sender or receiver does not exist.');
        }

        const invitation = {
            senderId: senderUid,
            receiverId: receiverUid,
//            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'waiting',
        };

        const docRef = await db.collection('invitations').add(invitation);

        await admin.firestore().collection('users').doc(senderUid).update({ status: "sender" + docRef.id });
        await admin.firestore().collection('users').doc(receiverUid).update({ status: "receiver" + docRef.id });


        return { success: true, message: 'Invitation sent successfully' , invitationUid : docRef.id};
    } catch (err) {
        console.error('Error sending invitation', err);
        if (err instanceof functions.https.HttpsError){
            throw err;
        }
        throw new functions.https.HttpsError('unknown', 'Error sending invitation');
    }
});

exports.deleteInvite = functions.https.onCall(async (data,context) => {

    if (!context.auth){
        throw new functions.https.HttpsError('unauthenticated', 'the function must be called while authenticated')
    }

    const userId = context.auth.uid;

    try {
        const invitationRef = db.collection('invitations');

        const sentInvitationsQuery = await invitationRef.where('senderId', '==', userId).get();
        const receivedInvitationsQuery = await invitationRef.where('receiverId', '==', userId).get();

        const deleteOperations = [];

        sentInvitationsQuery.forEach(doc => {
            deleteOperations.push(invitationRef.doc(doc.id).delete());
        });

        receivedInvitationsQuery.forEach(doc => {
            deleteOperations.push(invitationRef.doc(doc.id).delete());
        });

        await Promise.all(deleteOperations);

        return { success : true , message : 'All invitations have been deleted successfully.', };

    }catch (err){
        console.error('Error deleting invitations', err);
        throw new functions.https.HttpsError('internal' ,'An error occurred while deleting invitations.');
    }
});

exports.createLobby = functions.https.onCall(async (data, context) => {
    // Kullanıcı kimlik doğrulaması kontrolü
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Lobi oluşturmak için kullanıcı kimliği doğrulanmalıdır.');
    }
  
    const { invitationData } = data;
    let sender, receiver;
  
    // Davet verisine göre gönderen ve alıcıyı belirle
    if (invitationData) {
      const { senderId, receiverId } = invitationData;
      if (!senderId || !receiverId) {
        throw new functions.https.HttpsError('invalid-argument', 'Geçersiz davet verisi.');
      }
      sender = senderId;
      receiver = receiverId;
    } else {
      sender = context.auth.uid;
      receiver = "waitingPlayer";
    }
  
    try {
      const lobbyRef = db.collection('lobbies').doc();
      const lobbyData = {
        player1: sender,
        player2: receiver,
        inventoryType: 'default',
        lobbyStatus: 'waiting',
        game: [],
        // createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
  
      // Lobi belgesini Firestore'da oluştur
      await lobbyRef.set(lobbyData);
  
      // Oluşturulan lobi verisini döndür
      return {
        success: true,
        message: 'Lobi başarıyla oluşturuldu',
        lobbyData: {
          ...lobbyData,
          lobbyId: lobbyRef.id
        }
      };
    } catch (error) {
      console.error('Lobi oluşturulurken hata:', error);
      throw new functions.https.HttpsError('internal', 'Lobi oluşturulurken bir hata oluştu');
    }
  });

exports.deleteLobbyByUid = functions.https.onCall(async (data,context) => {
    const {lobbyUid} = data;

    if (!lobbyUid) {
        throw new functions.https.HttpsError('invalid-argument', 'Lobby UID is required.');
    }

    try {
        const lobbyRef = db.collection('lobbies').doc(lobbyUid);
        const lobbyDoc = await lobbyRef.get();

        if (!lobbyDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Lobby not found.');
        }

        await lobbyRef.delete();
        return { success: true, message: 'Lobby successfully deleted.' };
    }catch (err) {
        console.error('Error deleting lobby:', err);
        throw new functions.https.HttpsError('internal', 'An error occurred while deleting the lobby.');
    }
});

exports.updateLobbyStatus = functions.https.onCall(async (data, context) => {
    const {lobbyUid, newStatus} = data;

    if (!lobbyUid || !newStatus){
        throw new functions.https.HttpsError('invalid-argument', 'Lobby ID or new status is missing');
    }

    const lobbyRef = admin.firestore().collection('lobbies').doc(lobbyUid);

    try {
        const lobbyDoc = await lobbyRef.get();
        if (!lobbyDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Lobby document not found');
        }

        await lobbyRef.update({
            lobbyStatus: newStatus,
        });

        return { success: true, message: `Lobby status updated as ${newStatus}` };
    } catch (err) {
        console.error("Lobby status update failed", err);
        throw new functions.https.HttpsError('internal', 'Lobby status update failed', err);
    }
});

exports.updatePlayerStatus = functions.https.onCall(async (data,context) => {
    let {newStatus, playerUid} = data;

    if(!newStatus){
        throw new functions.https.HttpsError('invalid-argument', 'Missing parameters.');
    }

    if (!playerUid){
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Request had no playerUid and user is not authenticated.');
          }
        playerUid = context.auth.uid;
    }

    try{
        const playerRef = db.collection("users").doc(playerUid);
        await playerRef.update({ status : newStatus });

        return { success : true, message : "Player status updated successfully."};
    }catch (err){
        console.error("Error updating player status:", err);
        throw new functions.https.HttpsError('internal', 'Failed to update player status.');
    }
});

exports.updateInvitationStatus = functions.https.onCall(async (data, context) => {
    const {newStatus , invitationUid } = data; 
  
   
    if (!invitationUid || !newStatus) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing parameters.');
    }
  
    try {
      const invitationRef = db.collection("invitations").doc(invitationUid);
      await invitationRef.update({ status: newStatus }); 
  
      return { success : true , message: "Invitation status updated successfully." };
    } catch (err) {
      console.error("Error updating invitation status:", err);
      throw new functions.https.HttpsError('internal', 'Failed to update invitation status.');
    }
  });

exports.getPlayerUidTest = functions.https.onCall(async (data,context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'Kullanıcı doğrulaması yapılmamış.');
  }

  // Kullanıcının UID'si
  const userUid = context.auth.uid;

  // UID'yi döndür
  return { userUid: userUid };
})

exports.searchWaitingLobby = functions.https.onCall(async (data,context) => {
  const user = context.auth;

  if (!user) {
    throw new functions.https.HttpsError('failed-precondition', 'unAuth user');
  }

  try{
    const waitingLobbiesQuery = db.collection('lobbies')
            .doc('waitingLobbiesDoc')
            .collection('waitingLobbies')
            .where('status', '==', 'waiting')
            .limit(1); 

    const lobbySnapshot = await waitingLobbiesQuery.get();

    if (lobbySnapshot.empty) {  
      return { success: false };
    }

    const lobbyDoc = lobbySnapshot.docs[0];
    const lobbyRef = lobbyDoc.ref;
    const lobbyData = lobbyDoc.data();
    const referencedlobbyPath = lobbyData.lobbyRef.path;

    const referecedLobbyUid = referencedlobbyPath.split('/')[1];

    await db.runTransaction(async (transaction) =>{
      const lobbyDocData = await transaction.get(lobbyRef);

      if (lobbyDocData.exists && lobbyDocData.data().status === 'waiting'){
        transaction.update(lobbyRef, {status : 'occupied'});
      }else {
        throw new Error('Lobby is not available');
      }
    });

    return {
      success : true,
      lobbyDocUid : referecedLobbyUid,
      lobbyRefUid : lobbyDoc.id
    };

  }catch (err){
    throw new functions.https.HttpsError('unknown', err.message);
  }

});

exports.joinTheLobby = functions.https.onCall(async (data, context) => {
  const user = context.auth

  if(!user){
    throw new functions.https.HttpsError('failed-precondition','User is not auth');
  }

  const userId = user.uid;
  const lobbyUid = data.lobbyUid;

  if (!lobbyUid){
    throw new functions.https.HttpsError('invalid-argument','invalid lobbyUid');
  }

  try{
    let updatedLobbyData;

    await db.runTransaction(async (transaction) => {
            const lobbyRef = db.collection('lobbies').doc(lobbyUid);
            const lobbyDoc = await transaction.get(lobbyRef);

            if (!lobbyDoc.exists) {
                throw new Error('not-found', 'Lobby could not found');
            }

            let lobbyData = lobbyDoc.data();

            let playerFieldToUpdate = null;

            if (lobbyData.player2 === 'waitingPlayer') {
                playerFieldToUpdate = 'player2';
            } else if (lobbyData.player1 === 'waitingPlayer') {
                playerFieldToUpdate = 'player1';
            }

            if (!playerFieldToUpdate) {
                throw new Error('failed-precondition', 'Lobby has not empty field');
            }

            transaction.update(lobbyRef, {
                [playerFieldToUpdate]: userId,
                lobbyStatus: 'foundPlayer'
            });

          });
          
          const updatedLobbyDoc = await db.collection('lobbies').doc(lobbyUid).get();

          if (updatedLobbyDoc.exists) {
            updatedLobbyData = updatedLobbyDoc.data();
          }
        // 5. İşlem başarılı olursa true döndür
        return { success: true, lobbyData : updatedLobbyData, playerUid : userId };
  } catch (err){
      console.error("Transaction failed: ", err.message);
      throw new functions.https.HttpsError('unknown', err.message);
  }

});

exports.addToTheRef = functions.https.onCall(async (data,context) => {
  const lobbyUid = data.lobbyUid;

  if (!lobbyUid) {
    throw new functions.https.HttpsError('invalid-argument', 'invalid lobbyUid.');
  }

  try {

    const lobbyRef = db.collection('lobbies').doc(lobbyUid);
    
    const waitingLobbiesRef = db.collection('lobbies')
        .doc('waitingLobbiesDoc')
        .collection('waitingLobbies');

    const newDocRef = await waitingLobbiesRef.add({
      lobbyRef: lobbyRef,  
      status: 'waiting'
    })
    
    return {
      success : true,
      docUid: newDocRef.id
    }
  } catch (err){
    throw new functions.https.HttpsError('unknown', err.message);
  };
});

exports.deleteLobbyRef = functions.https.onCall(async (data, context) => {
  const lobbyRefUid = data;

  if (!lobbyRefUid) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid LobbyRefUid.');
  }

  const lobbyRefDoc = db.collection('lobbies').doc('waitingLobbiesDoc').collection('waitingLobbies').doc(lobbyRefUid);

  try {
    await db.runTransaction( async (transaction) => {
      const lobbyDocSnapshot = await transaction.get(lobbyRefDoc);

      if (!lobbyDocSnapshot.exists) {
        throw new functions.https.HttpsError('not-found', 'Lobi referansı bulunamadı.');
      }

      transaction.delete(lobbyRefDoc);
    });

    return { success : true , message : 'Lobby Ref succesfully deleted'};
  }catch (err){
    throw new functions.https.HttpsError('unknown',"an error occured while deleting lobby Ref");
  }

});