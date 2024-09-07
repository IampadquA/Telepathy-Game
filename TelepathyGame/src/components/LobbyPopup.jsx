import React, { useEffect, useLayoutEffect, useState } from 'react'
import {motion} from "framer-motion"
import { FaXmark } from "react-icons/fa6";
import { deleteLobbyByUid, updatePlayerStatus, setLobbyInfo, updateLobbyStatus } from '../FirebaseFunctions';

const LobbyPopup = ({handleLobbyClick , setIsInLobby , lobbyData}) => {
    const [_lobbyData,_setLobbyData] = useState({players : []})
   
    useEffect(() => {
        _setLobbyData(lobbyData);
        console.log('LobbyPopupData' , _lobbyData);
    }, [])


    async function handleQuitLobby(){
        await updateLobbyStatus(_lobbyData.lobbyUid,'playerLeftLobby');
        console.log('lobby status changed');
        await deleteLobbyByUid(_lobbyData.lobbyUid);
        await updatePlayerStatus('idle');
        setIsInLobby(false);
        handleLobbyClick();
        setLobbyInfo({
            lobbyUid : "",
            player1: "", // useContext kurdugunda burayi duzetl
            player2: "",
            inventoryType: "default",
        });
    }


  return (
    <motion.div className='absolute w-full flex flex-col bg-bgdarkerblue bg-opacity-70 content-center top-1/4 border-2' style={{maxWidth: 460,height: 255,borderRadius: 25,borderColor : "#3C3C3C", backdropFilter: 'blur(20px)'}}>
        <button className='w-4 h-4 text-txtthidary ml-auto mr-5 relative  top-5'> 
                <FaXmark className='w-4 h-4' onClick={handleLobbyClick}/>
        </button>
        <div className='flex flex-col w-full gap-3 px-6 py-7 '>
            {_lobbyData.players.map(player => (
            <div key={player.id} className='flex flex-row w-full items-center'>
                <img className='w-12 h-12 bg-gray-500 'style={{borderRadius : 50}} />
                    <h3 className='text-txtwh text-base font mx-4'>
                        {player.playerName} &nbsp; #{player.id}
                    </h3>
            </div>
            ))}
            <div className='text-txtwh text-base font mt-2' >Inventory Mode:  &nbsp;<div className=' inline-block'> {lobbyData.inventoryType}</div></div>
        </div>
        <button className='relative text-Error-text ml-auto mr-11 bottom-3' onClick={handleQuitLobby}>Quit Lobby</button>
    </motion.div>
)
}

export default LobbyPopup