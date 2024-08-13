import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRef,useEffect } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const InvitePopup = ({handleInviteClick , handleAfterInvite} ) => {
    const inputRef = useRef(null);
    const [succesMessage,setSuccesMessage] = useState(false)
    const [errorMessage,setErrorMessage] = useState(false)
    
    const playersdb = [{
        name : "MertyquA",
        id: 3225}]
    
    const [opponentPlayer,setOpponentPlayer] = useState("")  
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);  // 100ms delay
    
        return () => clearTimeout(timer);
    }, []);

    function handleInputKeydown( event ){
        if (event.key === "Enter"){
           
            handleInviteSubmit();
        }
    }

    function handleInviteSubmit(){
        const matchedPlayer = opponentPlayer.trim().split("#")
        console.log(matchedPlayer)

        if (playersdb.find(player => player.name === matchedPlayer[0] && player.id === Number(matchedPlayer[1]))){
            showSuccesMessage()
            //SendDatabase
            handleAfterInvite()

        }else {
            showErrorMessage()
        }
    }

    function showSuccesMessage(){
        setErrorMessage(false);
        setSuccesMessage(true);

        setTimeout(() => setSuccesMessage(false),10000)
    }

    function showErrorMessage(){
        setSuccesMessage(false);
        setErrorMessage(true);

        setTimeout(() => setErrorMessage(false),10000)
    }



  return (
    <motion.div className='absolute w-full flex flex-col bg-bgdarkerblue bg-opacity-70 justify-center content-center top-1/4 border-2' style={{maxWidth: 460,height: 255,borderRadius: 25,borderColor : "#3C3C3C", backdropFilter: 'blur(20px)'}}>
            <button className='w-4 h-4 text-white ml-auto mr-5 relative bottom-8 ' onClick={handleInviteClick}> 
                <FaXmark className='w-4 h-4' />
            </button>
            <div className='relative flex flex-col bottom-7'>
                <h2 className='text-txtwh text-base ml-8 m-2 font-semibold'>Invite Player</h2>
                <div className='relative flex justify-center w-full'>
                    <motion.input
                        className="flex w-full h-14 overflow-hidden border-borderRed bg-bgdarkblue bg-opacity-50 text-white font-normal text-base justify-center items-center p-4"
                        style={{ maxWidth: 408, borderWidth: 1 }}
                        ref={inputRef}
                        placeholder='Write player name with tag please'
                        maxLength={35}
                        onChange={(e) => setOpponentPlayer(e.target.value)}
                        onKeyDown={handleInputKeydown}
                        value={opponentPlayer}
                        
                    />
                        <button className='text-white self-center absolute end-12'>
                            <FaArrowRight onClick={handleInviteSubmit}/>
                        </button>

                </div>
            </div>

            {succesMessage && 
            <motion.div className='w-full h-9 bg-Error-grey text-Error-text content-center self-center text-center' style={{maxWidth : 408, borderRadius: 25}}>
                Invite Send!
            </motion.div>}

            {errorMessage && 
            <motion.div className='w-full h-9 bg-Error-red text-Error-text content-center self-center text-center' style={{maxWidth : 408, borderRadius: 25}}>
                Player Could Not Found
            </motion.div>}
    </motion.div>
  )
}

export default InvitePopup
