import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchLobbyByUserId, updateLobbyStatus } from '../FirebaseFunctions';

export const LoadingScreen = () => {
    const location = useLocation();
    const playerUid = location.state?.playerUid;
    const lobbyData = location.state?.lobbyData;


    const [lobbyUid,setLobbyUid] = useState("");
    const [players,setPlayers] = useState([]);
    const [inventoryMode,setInventoryMode] = useState("");
    const [status,setStatus] = useState(""); 

    useEffect(() => {
        console.log(lobbyData);
        setLobbyUid(lobbyData.lobbyUid);
        setPlayers(lobbyData.players);
        setInventoryMode(lobbyData.inventoryType);
    }, [playerUid,lobbyData]);

    useEffect(() => {
        const wantedState = 'loading';
        async function updateStatus(lobbyUid) {

            try {
                const result = updateLobbyStatus(lobbyUid,wantedState);
                console.log(result);
                setStatus(wantedState);
            } catch {
                console.error("Someting went wrong with updateStatus" , err);
            }
        }

        if (lobbyUid != ""){
            updateStatus(lobbyUid);
            console.log("it callaed");
        } else {
            console.log("LobbUid is ;" , lobbyUid);
        }



    },[lobbyUid]);

  return (
    <div className='w-full h-screen flex flex-col gap-24: relative justify-center items-center'>
        <div className='text-center text-8xl text-txtwh'>Loading Game</div>
        <div className='text-center text-txtwh'>
            <ul>
                <li>Lobby Id: {lobbyUid}</li>
                <li>Player 1: {players[0]?.playerName}</li>
                <li>Player 2: {players[1]?.playerName}</li>
                <li>Inventory Mode: {inventoryMode}</li>
                <li>status: {status}</li>
            </ul>
        </div>
    </div>
  )
}
