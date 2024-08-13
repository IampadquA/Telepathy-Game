import React, { useState } from 'react'
import {motion} from "framer-motion"
import { FaXmark } from "react-icons/fa6";

const LobbyPopup = ({handleLobbyClick , handleAfterInvite}) => {

    const lobbyList = [
        { id : 2345 , name : "IampadquA" },
        { id : 3225 , name : "MertyquA" },
    ]

    function handleQuitLobby(){
        handleLobbyClick();
        handleAfterInvite();
    }

    const [inventoryMode, setInventoryMode] = useState("Default")

  return (
    <motion.div className='absolute w-full flex flex-col bg-bgdarkerblue bg-opacity-70 content-center top-1/4 border-2' style={{maxWidth: 460,height: 255,borderRadius: 25,borderColor : "#3C3C3C", backdropFilter: 'blur(20px)'}}>
        <button className='w-4 h-4 text-txtthidary ml-auto mr-5 relative  top-5'> 
                <FaXmark className='w-4 h-4' onClick={handleLobbyClick}/>
        </button>
        <div className='flex flex-col w-full gap-3 px-6 py-7 '>
            {lobbyList.map(player => (
            <div key={player.id} className='flex flex-row w-full items-center'>
                <img className='w-12 h-12 bg-gray-500 'style={{borderRadius : 50}} />
                    <h3 className='text-txtwh text-base font mx-4'>
                        {player.name} &nbsp; #{player.id}
                    </h3>
            </div>
            ))}
            <div className='text-txtwh text-base font mt-2' >Inventory Mode:  &nbsp;<div className=' inline-block'> {inventoryMode}</div></div>
        </div>
        <button className='relative text-Error-text ml-auto mr-11 bottom-3' onClick={handleQuitLobby}>Quit Lobby</button>
    </motion.div>
)
}

export default LobbyPopup