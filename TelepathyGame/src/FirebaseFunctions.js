import { collection,getDoc, getDocs, setDoc , doc } from 'firebase/firestore';
import { db , auth } from '../firebase-config.js';
import { signInAnonymously , onAuthStateChanged  } from "firebase/auth";


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

export const getInventory = async (inventoryId ,InventoryName) => {
    
    const inventoryDocRef = doc(inventoryTypeCollection , inventoryId);
    
    const inventoryCollection = collection(inventoryDocRef, InventoryName);
    try{
        const inventoryData = await getDocs(inventoryCollection);
        const filteredData = inventoryData.docs.map((doc) => ({...doc.data(), id: doc.id}));
        console.log(filteredData);
        return filteredData;
    } catch (err) {
        console.log(err);
    }
}

export const handleAuth = async (userId,userName) => {
    try{

        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;

        await setDoc(doc(db,"users",user.uid),{
            id : userId,
            userName : userName,
            createDate : new Date(),
        });
        
        console.log("Kullanıcı oluşturuldu",userId)
    } catch (err){
        console.error(err);
    }
};

export const getPlayer = async (userUid) => {
    try{
        const playerDocRef = doc(db,'users', userUid);
        const playerDoc = await getDoc(playerDocRef);

        if (playerDoc.exists()){
            return playerDoc.data();
        } else {
            console.log("Not found doc");
            return null;
        }
    } catch (err){
        console.error(err);
        return null;
    }

}

export const getAllPlayerIds = async () => {
    try {
        const userCollection = collection(db,'users');

        const querySnapshot = await getDocs(userCollection);

        const userIds = querySnapshot.docs.map(doc => doc.data().id);

        console.log(userIds);
        console.log(typeof userIds);
        console.log(Array.isArray(userIds));
        return userIds;
    } catch (err){
        console.error(err);
        return [];
    }
}

  

