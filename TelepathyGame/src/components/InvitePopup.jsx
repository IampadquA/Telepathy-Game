import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRef,useEffect } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { sendInvite, listenInviteStatus, getUserDataById, listenToInvitationStatus, updatePlayerStatus, getLobbyDataByUid, setLobbyInfo, deleteInvite } from '../FirebaseFunctions';

const InvitePopup = ({handleInviteClick , handleAfterInvite , senderId , setIsInLobby , setDoesHaveNotification , setLobbyData } ) => {
    const inputRef = useRef(null);
    const [succesMessage,setSuccesMessage] = useState(false)
    const [errorMessage,setErrorMessage] = useState(false)
    const [errorText,setErrorText] = useState("Something Went Wrong");
    
    const [opponentPlayer,setOpponentPlayer] = useState(""); 
    const [receiverData,setReceiverData] = useState();

    function handleInputKeydown( event ){
        if (event.key === "Enter"){
           
            handleInviteSubmit(senderId);
        }
    }

    function checkandParseInput(input) {
        const regex = /^[^\s#]{0,32}#[1-9][0-9]{3,5}$/;

        if (!regex.test(input.trim())) {
            return null;  
        }

        const [username, id] = input.trim().split("#");
        const receiverId = Number(id);

        console.log("checkandParseInput is" , username , receiverId);
        return { username, receiverId };
    }

    async function handleInviteSubmit(senderId) {
        const opponentData = checkandParseInput(opponentPlayer);

        if (!opponentData){
            showErrorMessage("Invalid input format. Please ensure the username and ID are correctly formatted.");
            return; 
        }

        const {receiverId} = opponentData; 

        if (receiverId === senderId){
            showErrorMessage("You can't Invite yourself (except one user) what are you tryna do ??");
            return;
        }
        
        let receiverDataRef;
        try {
            receiverDataRef = await getUserDataById(receiverId);
        }catch (err) {
            console.log("Player Not Found", err);
            showErrorMessage("Player Not Found");
            return;
        }
            
        if (receiverDataRef.status !== "idle") {
            showErrorMessage("Player already has an Invitation or Not avaible");
            return;
        }
            
        try {
            console.log(receiverDataRef.Uid);
            const result = await sendInvite(receiverDataRef.Uid);
    
            if (!result.success) {
                showErrorMessage("Something went wrong");
                console.log(result.message);
                return;
            }
            
            showSuccesMessage(result.message);
            
            console.log("Listen to ınvite statuse giren id :" , result.invitationUid)
            const invitationStatusResult = await listenToInvitationStatus(result.invitationUid);
            console.log("Çıkan sonuç :", invitationStatusResult.success);
            
            if (invitationStatusResult){
                const lobbyData = await getLobbyDataByUid(invitationStatusResult.subString);
                console.log('Lobby Data is' , lobbyData);
                console.log('LobbyData0',lobbyData);
                console.log('LobbyData1',lobbyData.data);
                await setLobbyInfo(lobbyData.data,setLobbyData);
                setDoesHaveNotification(true);
                setIsInLobby(true);
                //setPlayerStatus InLobby
                updatePlayerStatus("inLobby");
                deleteInvite(); // can be improvable
            }else {
                updatePlayerStatus("idle");
                setDoesHaveNotification(true);
                deleteInvite();
            }
        } catch (error) {
            console.error("Error sending invite:", error);
            showErrorMessage("Failed to send invitation");
        }
    }

    function showSuccesMessage(){
        setErrorMessage(false);
        setSuccesMessage(true);

        setTimeout(() => setSuccesMessage(false),10000)
    }

    function showErrorMessage(errtext){
        setSuccesMessage(false);
        setErrorMessage(true);
        
        if (errtext){
            setErrorText(errtext);
        }
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
                            <FaArrowRight onClick={() => handleInviteSubmit(senderId)}/>
                        </button>

                </div>
            </div>

            {succesMessage && 
            <motion.div className='w-full h-9 bg-Error-grey text-Error-text content-center self-center text-center' style={{maxWidth : 408, borderRadius: 25}}>
                Invite Send!
            </motion.div>}

            {errorMessage && 
            <motion.div className='w-full h-9 bg-Error-red text-Error-text content-center self-center text-center' style={{maxWidth : 408, borderRadius: 25}}>
                {errorText}
            </motion.div>}
    </motion.div>
  )
}

export default InvitePopup
