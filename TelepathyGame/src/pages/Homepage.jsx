import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import { Footer } from '../components/Footer';
import AdPlace from '../components/AdPlace';
import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import InvitePopup from '../components/InvitePopup';
import InviteRequestPopup from '../components/InviteRequestPopup'
import LobbyPopup from '../components/LobbyPopup';
import { Link, useNavigate } from 'react-router-dom'; 
import { handleAuth , getAllPlayerIds ,
    fetchLobbyByUserId , getUserDataByUid,
    listenToUserStatus,
    setLobbyInfo,
    listenToLobbyStatus,
    updatePlayerStatus,
 } from '../FirebaseFunctions';
 import { onAuthStateChanged } from 'firebase/auth';
 import { auth } from '../../firebase-config';
 import NotificationBar from '../components/NotificationBar';

 
 const Homepage = () => {
     
    const navigate = useNavigate();
     
    const [isClickedPlay, setIsClickedPlay] = useState(false);
    const [isSubmitInput, setIsSubmitInput] = useState(true);
     
    const [playerName,setPlayerName] = useState("")
    const [playerid, setPlayerId] = useState(0);
    const [playerUid,setPlayerUid] = useState('');
    const [playerStatus,setPlayerStatus] = useState("");

    const [isInviteClicked,setIsInviteClicked] = useState(false);
    const [isInvited,setIsInvited] = useState(false);
    const [isInLobby,setIsInLobby] = useState(false);
    
    const [doesHaveNotification,setDoesHaveNotification] = useState(false);

    const [lobbyData,setLobbyData] = useState({
        lobbyUid : "",
        player1: playerName,
        player2: "",
        inventoryType: "default",
    })
    
    const [isLobbyClicked,setIsLobbyClicked] = useState(false);

    
    
    const [animationState, setAnimationState] = useState('visible');
    const [animationState2,setAnimationState2] = useState('hiddenin');
    const [animationStateInvite,setAnimationStateInvite] = useState('visible');
    
    const inputRef = useRef(null); // useRef tanımlandı
    useEffect(() => {
        // onAuthStateChanged ile kullanıcıyı kontrol ediyoruz
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try{
                    console.log("user is", user.uid)
                    setPlayerUid(user.uid);
                    const playerData = await getUserDataByUid(user.uid)
                    setPlayerId(playerData.id);
                    setPlayerName(playerData.userName);
                    setPlayerStatus(playerData.status);
                    setIsClickedPlay(true);
                    setIsSubmitInput(true);
                } catch (err){
                    console.error(err)
                }
            } else {
                console.log('No user is signed in');
                // Kullanıcı çıkış yaptıysa veya giriş yapmamışsa burası çalışır
                setPlayerId(null);
                setPlayerName('');
                setIsClickedPlay(false);
                setIsSubmitInput(true);
            }
        });

        return () => unsubscribe();
        
    },[])


    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                 inputRef.current.focus();
            }
        }, 100);  // 100ms delay
    
        return () => clearTimeout(timer);
    }, [isClickedPlay]);
    
    useEffect(() => {
        // Eğer playerUid mevcut değilse, fonksiyonu çalıştırma
        if (!playerUid) return;
    
        // Kullanıcı statüsünü dinlemek için yardımcı fonksiyonu çağır
        const unsubscribe = listenToUserStatus(playerUid, (status) => {
          if (status && status.startsWith('receiver')) {
            const invitationUid = status.split('receiver')[1];
            console.log("InvitationUid:", invitationUid);
            console.log(true);
            setIsInvited(true);
            setPlayerStatus(invitationUid);
          } else {
            console.error("User does not have an invitation");
          }
        });
    
        // Bileşen kaldırıldığında dinleyiciyi temizle
        return () => unsubscribe();
      }, [playerUid]); 

    useEffect(() => {
        async function setDatafromStatus(){
            if (!playerStatus){
                console.log('There is no player status');
                return;
            }

            if (playerStatus === 'inLobby'){
                if (lobbyData.lobbyUid !== ""){
                    console.log('Lobby data is here');
                    return;
                }

                const _lobbyData = await fetchLobbyByUserId(playerUid);// this can be imrpoved
                console.log('LobbyData is :' , _lobbyData) 

                setLobbyInfo(_lobbyData,setLobbyData);
                setIsInLobby(true);
            }

            else if (playerStatus === 'inGame' || playerStatus === 'loading'){
                // navigatee
            }
        }

        setDatafromStatus().then(console.log('RESULT IS :' , lobbyData));
    },[playerStatus]);

    useEffect(() => {
        if (doesHaveNotification){

            const timer = setTimeout(() => {
                setDoesHaveNotification(false);
            }, 10000);
            
            
            return () => clearTimeout(timer);
        }

    }, [doesHaveNotification]);

    useEffect(() => {
        if (!isInLobby){
            console.error('user is not in a lobby');
        }

        if (lobbyData.lobbyUid === ""){
            console.log("LobbyUid is null");
            return;
        }

        const unsubscribe = listenToLobbyStatus(lobbyData.lobbyUid,(status) => {
            if (status === 'loading'){
                navigate('/LoadingPage', {state: { playerUid: playerUid, lobbyData: lobbyData }});
            }else if (status === 'playerLeftLobby'){
                handlePlayerLobbyQuit();
            }
        });

        return () => unsubscribe?.();
    },[isInLobby,lobbyData.lobbyUid])

    async function handlePlayClick() {
        setAnimationState('hidden');
        try{
            const playerIds = await getAllPlayerIds();

            const playerIdsArray = Array.from(playerIds);

            const newId = giveId(playerIdsArray)
            setPlayerId(newId);
        } catch (err){
            console.error(err);
        }
        setTimeout(() => {setIsClickedPlay(true); setIsSubmitInput(false)}, 500);
        setAnimationState2("visiblein")
    }

    function handleInviteClick(){
        setIsInviteClicked((prevState) => !prevState);
    }

    function handleAfterInvite(){
        setAnimationStateInvite("hidden");
    }

    function handleInviteReq(){
        setIsInvited((prevState) => !prevState);
    }

    function handleLobbyClick(){
        setIsLobbyClicked((prevState) => !prevState);
    }

    function handleQuickPlayClick() {
        if (isInLobby) {
            navigate("/LoadingPage", { state: { playerUid: playerUid, lobbyData: lobbyData } });
        } else {
            navigate("/SearchingPage",  { state: { playerUid: playerUid, playerName: playerName , playerId : playerid } });
        }
    }

    const handleSubmit = () => {
        if (playerName.trim() !==''){
            console.log('Enter key pressed');
            console.log('Input value:', playerName);

            handleAuth(playerid,playerName)
            
            setAnimationState2("hidden")
            
            setTimeout(() => setIsSubmitInput(true), 100)
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }

        if (event.key === "#"){
            //Todo later You cannot do that 
        }
    };

    function giveId(players_ids) {
        console.log("It works" ,players_ids);

        const MIN_ID = 1000;
        const MAX_ID = 9999;


        let newId;
        let isUnique = false;

        while (!isUnique) {
            newId = Math.floor(MIN_ID + Math.random() * (MAX_ID - MIN_ID + 1));

            if (!players_ids.includes(newId)) {
                isUnique = true;
            }
        }

        players_ids.push(newId);
        return newId;
    }

    async function handlePlayerLobbyQuit() {
        setDoesHaveNotification(true);
        await updatePlayerStatus('idle');
        setIsInLobby(false);
        isLobbyClicked(false);
        setLobbyInfo({
            lobbyUid : "",
            player1: "", // useContext kurdugunda burayi duzetl
            player2: "",
            inventoryType: "default",
        });
        console.log('PlayerLeftTheLobby');
    }
    

    const variants = {
        hidden: { height: 0 },
        visible: { height: 56 },
        hiddenin : { height: 0, padding: 0 },
        visiblein : { height: 56, padding: 24 },
    };
    
    return (
        <div className='flex justify-center h-screen'>
            <div className='flex flex-col gap-y-16 self-center items-center' style={{ maxWidth: 1000, maxHeight: "fit-content" }}>
                <h1 className='text-txtwh text-7xl font-bold text-center'>Telepathy Game</h1>
                <p className='text-txtsecondary text-base font-normal text-center'>
                Are you ready to test your telepathic abilities? In this game, logic meets intuition in a thrilling mental challenge! <br /><br />
                Each round, you choose an item, and your mission is simple: match your choice with your partner's. But beware—there are no clues, only the whispers of your mind to guide you!<br /><br />
                Remember: The mind is the universe’s greatest mystery... and in this game, you hold the key to unlocking it!<br /><br />
                </p>
                <div className='flex gap-2 flex-col items-center w-full' style={{ maxWidth: 580 }}>
                    {!isClickedPlay && 
                        <motion.div
                            variants={variants}
                            initial="visible"
                            animate={animationState}
                            exit="hidden"
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ backgroundColor: "#884449" }}
                            className="flex w-full overflow-hidden border-borderRed bg-bgblue bg-opacity-50 text-center text-white font-normal text-base justify-center items-center cursor-pointer"
                            onClick={handlePlayClick}
                            style={{ maxWidth: 408, borderWidth: 1 }}
                        >
                            play
                        </motion.div>
                    }
                    {!isSubmitInput && (
                        <div className='relative flex justify-center w-full'>
                            <motion.input
                                variants={variants}
                                initial= "hiddenin"
                                animate= {animationState2}
                                transition={{ duration: 0.5 }}
                                className="flex w-full overflow-hidden border-borderRed bg-bgdarkblue bg-opacity-50 text-white font-normal text-base justify-center items-center"
                                style={{ maxWidth: 408, borderWidth: 1 }}
                                ref={inputRef}
                                placeholder='Enter Your name to play'
                                maxLength={30}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => setPlayerName(e.target.value)}
                                value={playerName}
                            />
                            <motion.div 
                            className='absolute gap-3 flex end-24 self-center border-l-2 border-white text-white px-2 pl-4'>
                                <div>#{playerid}</div>
                                <button onClick={handleSubmit}>
                                    <FaArrowRight />
                                </button>
                            </motion.div>
                        </div>
                    )}
                    {isClickedPlay && isSubmitInput &&
                        <>
                            <motion.div
                                variants={variants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.5 }}
                                className= "flex gap-x-2 px-28 w-full"
                                >
                                    <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ backgroundColor: "#884449" }}
                                    className='w-full overflow-hidden border-borderRed bg-bgblue bg-opacity-50 text-center text-white font-normal text-base' style={{maxWidth: 408,borderWidth: 1}}>{playerName} #{playerid}</motion.button>
                                    <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ backgroundColor: "#884449" }}
                                    onClick={handleQuickPlayClick}
                                    className='w-full h-full overflow-hidden border-borderRed bg-bgblue bg-opacity-50 text-center text-white font-normal text-base' style={{maxWidth: 408,borderWidth: 1}}>QuickPlay</motion.button>
                            </motion.div>
                            {!isInLobby && 
                            <motion.div 
                            className='relative flex w-full justify-center'>
                                <Button buttonText={"Invite"} onClick={handleInviteClick} className={"relative w-full mx-28"}></Button>
                            </motion.div> }
                            {isInLobby && 
                            <motion.div 
                            className='flex w-full justify-center'>
                                <Button buttonText={"Lobby"} onClick={handleLobbyClick} className={"w-full mx-28"}></Button>
                            </motion.div>}
                        </>
                    }
                    <div className='flex gap-x-2 px-28 w-full'>
                        <motion.div whileHover={{ boxShadow: '0 0 45px rgba(136, 68, 73, 1)' }} className='w-full'>
                            <Button buttonText={"Donate"} className="w-full" />
                        </motion.div>
                        <Link to="/Inventory" className='w-full'>
                            <Button buttonText={"Inventory"} className="w-full">
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            {isInviteClicked && <InvitePopup handleInviteClick={handleInviteClick} handleAfterInvite={handleAfterInvite} setIsInLobby={setIsInLobby} setDoesHaveNotification={setDoesHaveNotification} senderId={playerid} setLobbyData={setLobbyData}/>}
            {isInvited && <InviteRequestPopup setIsInvited={setIsInvited} InvitationUid={playerStatus} setIsInLobby={setIsInLobby} setLobbyData={setLobbyData}/>} 
            {isLobbyClicked && <LobbyPopup handleLobbyClick={handleLobbyClick} handleAfterInvite={handleAfterInvite} setIsInLobby={setIsInLobby} lobbyData={lobbyData}/>}
            {doesHaveNotification && <NotificationBar text={"Invite Accapted"} />}
            {//<AdPlace width={160} height={550} className={"absolute end-6 top-14"} />
            }
            <Footer />
        </div>
    );
}

export default Homepage;
