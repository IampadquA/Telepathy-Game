import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Button from './Button';
import { createLobby, fetchInvtationById, getUserDataByUid, updateInvitationStatus, updatePlayerStatus , setLobbyInfo } from '../FirebaseFunctions';
import { func } from 'prop-types';

const InviteRequestPopup = ({setIsInvited, InvitationUid , className ,setIsInLobby, setLobbyData }) => {
    const [inviter,setInviter] = useState({playerName : "LoadingPlayer" , id : 0});
    const [lobbyType,setLobbyType] = useState("default");
    const [invitationData,setInvitationData] = useState();

    useEffect(() => {
        
        if (!InvitationUid) {
            return;
        }

        const fetchData = async () => {
            try {
                const result = await fetchInvtationById(InvitationUid);
                console.log(result.senderData);
                console.log(result.invitationData);
                setInvitationData(result.invitationData);
                setInviter(result.senderData);
            } catch (err){
                throw new Error("Somethign went wrong with sender data fetching",err);
            }
        }

        fetchData();
    },[InvitationUid]);

    function handleDecisionClick(decicion){
        if (decicion){
            handleInviteAccept();
        }else {
            handleInviteReject();
        }
    }

    async function handleInviteAccept() {
        setIsInvited(false);
        console.log('Invitatoin Data is :' , invitationData);
        const lobbyData = await createLobby(invitationData)
        console.log('LobbyData is :' , lobbyData);    
        await setLobbyInfo(lobbyData,setLobbyData);
        setIsInLobby(true);
        const playerresult = await updatePlayerStatus("inLobby");
        console.log('Player status updated:', playerresult);
        const invitationlobbyDirectStatus = 'accepted' + lobbyData.lobbyId;
        console.log(invitationData.id)
        const inviteresult = await updateInvitationStatus(invitationlobbyDirectStatus,invitationData.id);
        console.log('Invitation status updated:', inviteresult);
    }

    async function handleInviteReject() {
        setIsInvited(false);
        const playerresult = await updatePlayerStatus("idle");
        console.log('Player status updated:', playerresult);
        console.log(invitationData.id)
        const inviteresult = await updateInvitationStatus("rejected",invitationData.id);
        console.log('Invitation status updated:', inviteresult);
    }

  return (
    <motion.div className={`absolute w-full flex flex-col bg-bgdarkerblue bg-opacity-70 content-center top-1/4 border-2 justify-center ${className}`} style={{maxWidth: 460,height: 255,borderRadius: 25,borderColor : "#3C3C3C", backdropFilter: 'blur(20px)'}}>
        <motion.div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-col gap-3 '>
                <div>
                    <h1 className='text-center text-xl font-semibold text-txtwh'>{inviter.playerName}</h1>
                    <div className='text-center text-xs text-txtthidary font-normal'>#{inviter.id}</div>
                </div>
                <div className='text-center text-xl text-txtwh'>sent invite to you!</div>
                <h3 className='text-center text-base text-txtwh '>Inventory mode:<div className=' inline-block font-semibold'> &nbsp; {lobbyType}</div></h3>
            </div>
            <div className='flex gap-9'>
                <Button buttonText={"accept"} className={'w-36 max-h-11'} onClick={() => handleDecisionClick(true)}/>
                <motion.button 
                whileHover={{scale : 0.9}}
                whileTap={{rotate: 15}}
                className='w-36 h-11 border-2 border-borderRed text-borderRed'
                onClick={() => handleDecisionClick(false)}
                >decline</motion.button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default InviteRequestPopup;

