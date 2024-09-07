import { collection,getDoc, getDocs, setDoc , updateDoc, doc, query, onSnapshot, QuerySnapshot , where } from 'firebase/firestore';
import { db , auth } from '../firebase-config.js';
import { signInAnonymously , onAuthStateChanged  } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { func } from 'prop-types';



const inventoryTypeCollection = collection(db,"Inventorys")

export const getInventorys = async () => {
    try{
        const inventorysData = await getDocs(inventoryTypeCollection);
        const filteredData = inventorysData.docs.map((doc) => ({...doc.data(), id: doc.id}));
        console.log(filteredData);
        return filteredData;
    } catch (err) {
        console.error(err);
    }

}

export const getInventory = async (inventoryId, inventoryName) => {
    const functions = getFunctions();
    const getInventoryFunction = httpsCallable(functions, 'getInventory');
    return await getInventoryFunction({ inventoryId, inventoryName });
  };

export const handleAuth = async (userId,userName) => {
    try{

        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;

        await setDoc(doc(db,"users",user.uid),{
            id : userId,
            userName : userName,
            status : "idle",
            createDate : new Date(),
        });
        
        console.log("Kullanıcı oluşturuldu",userId)
    } catch (err){
        console.error(err);
    }
};

export const getAllPlayerIds = async () => {
    const functions = getFunctions();
    const getAllPlayerIdsFunction = httpsCallable(functions, 'getAllPlayerIds');
    return await getAllPlayerIdsFunction();
  };


export const sendInvite = async (receiverUid) => {
    try {
        const functions = getFunctions();
        const sendInvitationFunction = httpsCallable(functions,'sendInvite');

        console.log(receiverUid);
        const result = await sendInvitationFunction({receiverUid});

        return result.data;
    } catch (err){
        console.error(err);
        throw err;
    }
};

export function listenInviteStatus(InviteUid, callback){
    const InviteRef = doc(db,'invitations', InviteUid);

    const unsubsribe = onSnapshot(InviteRef, (doc) => {
        if (doc.exists()) {
            const status = doc.data().status;
            callback(status);
            console.log("Listening Invite Status");
        }
    });

    return unsubsribe;
}

export function listenToUserStatus(playerUid, callback) {
    // Firestore'daki kullanıcının doküman referansını al
    const playerRef = doc(db, 'users', playerUid);
  
    // Firestore'da dokümanı dinlemek için `onSnapshot` kullan
    const unsubscribe = onSnapshot(playerRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const playerData = docSnapshot.data();
        const status = playerData.status;
  
        // status alanı değiştiğinde çağrılacak olan callback fonksiyonu
        callback(status);
      } else {
        console.error("Player does not exist");
      }
    });
  
    // Dinleyiciyi kaldırmak için `unsubscribe` fonksiyonunu döndür
    return unsubscribe;
  }

export async function fetchInvtationById(invitationUid) {
    try{

        const firebaseUidRegex = /^[a-zA-Z0-9]{20}$/;

        if (!firebaseUidRegex.test(invitationUid)){
            throw new Error("Invalid invitation ID format");
        }

        const invitationRef = doc(db,'invitations', invitationUid);
        const invitationDoc = await getDoc(invitationRef);

        if (!invitationDoc.exists()){
            throw new Error("Invitation could not find");
        }

        const invitationData = invitationDoc.data();
        const senderUid = invitationData.senderId;

        const senderData = await getUserDataByUid(senderUid);

        return {senderData : {
            playerName : senderData.userName,
            id : senderData.id
            },
            invitationData : {id : invitationDoc.id , ...invitationData}
        };
    }catch (err){
        console.error("Something went wrong with fethcing data with invitation id", err);
        throw err;
    }
};

export function listenToInvitationStatus(invitationUid) {
    return new Promise((resolve, reject) => {
      try {
        const invitationRef = doc(db, 'invitations', invitationUid);
  
        const unsubscribe = onSnapshot(invitationRef, (docSnapshot) => {
          if (!docSnapshot.exists()) {
            unsubscribe();
            return reject(new Error('Invitation document not found.'));
          }
  
          const data = docSnapshot.data();
  
          if (!data || typeof data.status === 'undefined') {
            unsubscribe();
            return reject(new Error('Status field is missing in the invitation document.'));
          }
  
          const status = data.status;
  
          if (status.startsWith('accepted')) {
            unsubscribe();
            const subString = status.slice('accepted'.length).trim();

            return resolve({success : true , subString});
          } else if (status === 'rejected') {
            unsubscribe();
            return resolve({success : false});
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

export async function deleteInvite() {
    try {
        const functions = getFunctions();
        const deleteInviteFunction = httpsCallable(functions, 'deleteInvite');
        const result = await deleteInviteFunction();
        console.log(result.data.message);
    } catch (err){
        console.error(err);
    }
};
  
export async function createLobby(invitationData) {
    const functions = getFunctions();

    const createLobbyFunction = httpsCallable(functions ,'createLobby');

    try{
        const result = await createLobbyFunction( {invitationData} );
        console.log(result.data.succes , result.data.message);
        return result.data.lobbyData;
    } catch (err){
        console.error('Error creating lobby: ', err);
        throw err;
    }
};

export async function getLobbyDataByUid(lobbyUid) {
    try {
      const lobbyRef = doc(db, 'lobbies', lobbyUid);
  
      const lobbySnapshot = await getDoc(lobbyRef);
  
      if (!lobbySnapshot.exists()) {
        throw new Error('Lobby not found.');
      }

      const lobbyData = lobbySnapshot.data();

      return { success: true, data: {...lobbyData, lobbyId: lobbySnapshot.id } };
  
    } catch (err) {
      console.error('Error fetching lobby data:', err);
      return { success: false, error: err.message };
    }
  }

export async function setLobbyInfo(lobbyData,setLobbyData){

    const sender = await getUserDataByUid(lobbyData.player1);
    console.log('Sender',sender);
    const receiver = await getUserDataByUid(lobbyData.player2);
    console.log('Sender',receiver);
    setLobbyData({
        lobbyUid : lobbyData.lobbyId,
        players : [{playerName : sender.userName, id : sender.id}, {playerName : receiver.userName, id : receiver.id},],
        inventoryType: lobbyData.inventoryType,
    });
};

export function listenToLobbyStatus(lobbyUid, callback) {
    if (!lobbyUid) {
      console.error("Invalid lobbyUid provided.");
      callback(null, new Error("Invalid lobbyUid"));
      return () => {}; // Return a no-op function
    }
  
    const lobbyRef = doc(db, 'lobbies', lobbyUid);
  
    const unsubscribe = onSnapshot(lobbyRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        console.error("Lobby document does not exist.");
        callback(null, new Error("Lobby document does not exist"));
        return;
      }
  
      const lobbyData = docSnapshot.data();
      const lobbyStatus = lobbyData?.lobbyStatus;
  
      if (lobbyStatus === undefined) {
        console.error("Lobby status field is missing in the lobby document.");
        callback(null, new Error("Lobby status field is missing"));
        return;
      }
  
      callback(lobbyStatus, null);
    }, (error) => {
      console.error("Error listening to lobby status:", error);
      callback(null, error);
    });
  
    return unsubscribe;
}

export async function fetchLobbyByUserId(userUid) {
    try{
        const lobbiesRef = collection(db, "lobbies");

        const q1 = query(lobbiesRef, where("player1", "==", userUid));
        const q2 = query(lobbiesRef, where("player2", "==", userUid));

        const [querySnapshot1, querySnapshot2] = await Promise.all([
            getDocs(q1),
            getDocs(q2)
        ]);

        let lobbyData = null;

        if (!querySnapshot1.empty) {
            const doc = querySnapshot1.docs[0];
            lobbyData = { ...doc.data(), lobbyId: doc.id };
        } else if (!querySnapshot2.empty) {
            const doc = querySnapshot2.docs[0];
            lobbyData = { ...doc.data(), lobbyId: doc.id }; 
        }

        console.log("LobbyData is", lobbyData);

        if (lobbyData) {
            console.log("Lobby found:", lobbyData);
            return lobbyData;
        } else {
            console.error('User is not any lobby');
            return null;
        } 
    } catch (err){
        console.error('Error fetching lobby', err)
            throw err;
        }
};

export async function getUserDataByUid(uid) {
    try {
        // Kullanıcının Firestore dokümanını referans alıyoruz

        if (!uid || uid == ""){
            throw new Error("playerUid is empty");
        }

        const userDocRef = doc(db, 'users', uid);
        
        // Dokümanı getiriyoruz
        const userDoc = await getDoc(userDocRef);
        
        // Eğer doküman mevcutsa, verileri döndürüyoruz
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error('Kullanıcı bulunamadı');
        }
    } catch (error) {
        console.error('UID ile kullanıcı verilerini bulurken hata oluştu:', error);
        throw error;
    }
};

export async function getUserDataById(id) {
    try {
        const usersCollectionRef = collection(db,'users');
        const q = query(usersCollectionRef , where('id', '==', id));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty){
            throw new Error("Error matching specified Id");
        }

        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;

        return { Uid: userId , ...userDoc.data() }
    } catch (err){
        console.error("Error finding user data by ID:", err);
        throw err;
    }
}

export const deleteLobbyByUid = async (lobbyUid) => {
    const functions = getFunctions();
    const deleteLobbyByUidFunction = httpsCallable(functions, 'deleteLobbyByUid');
    try {
        const result = await deleteLobbyByUidFunction({ lobbyUid });
        console.log(result.data.message);
    } catch (err) {
        console.error('err deleting lobby:', err);
    }
};

export async function updatePlayerStatus(newStatus,playerUid) {
    const functions = getFunctions();
    const updatePlayerStatusFunction = httpsCallable(functions, 'updatePlayerStatus');

    try {
        const result = await updatePlayerStatusFunction({ newStatus , playerUid });
        console.log(result.data.message); 
        return result.data; 
    } catch (err) {
        console.error('Error updating player status:', err);
        throw err; 
    }
}

export async function updateInvitationStatus(newStatus, invitationUid ) {
    const functions = getFunctions();
    const updateInvitationStatusFunction = httpsCallable(functions, 'updateInvitationStatus');

    try {
        const result = await updateInvitationStatusFunction({newStatus, invitationUid });
        console.log(result.data.message);
        return result.data; 
    } catch (err) {
        console.error('Error updating invitation status:', err);
        throw err; 
    }
}

export async function updateLobbyStatus(lobbyUid,status) {
    const functions = getFunctions();
    const updateLobbyStatusFunction = httpsCallable(functions, 'updateLobbyStatus');

    try{
        const result = await updateLobbyStatusFunction({lobbyUid , newStatus : status});
        console.log(result);
        console.log(result.data.message);
    }catch(err) {
        console.error('Error updating status :' , err);
    }
}

export function listenLobbyStatus(lobbyUid, callback){
    const lobbyRef = doc(db,'lobbies', lobbyUid);

    const unsubsribe = onSnapshot(lobbyRef, (doc) => {
        if (doc.exists()) {
            const status = doc.data().lobbystatus;
            callback(status);
        }
    });

    return unsubsribe;
}
