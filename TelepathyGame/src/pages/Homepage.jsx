import React, { useEffect, useRef, useState } from 'react'; // useRef eklenmiş
import Button from '../components/Button';
import { Footer } from '../components/Footer';
import AdPlace from '../components/AdPlace';
import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
import InvitePopup from '../components/InvitePopup';
import LobbyPopup from '../components/LobbyPopup';
import { Link } from 'react-router-dom'; 
import { handleAuth , getPlayer , getAllPlayerIds } from '../FirebaseFunctions';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';


const MotionButton = motion(Button);

const Homepage = () => {
    const [isClickedPlay, setIsClickedPlay] = useState(false);
    const [isSubmitInput, setIsSubmitInput] = useState(true);
    const [isInviteClicked,setIsInviteClicked] = useState(false);
    const [isInLobby,setIsInLobby] = useState(false);
    const [isLobbyClicked,setIsLobbyClicked] = useState(false)
    const [animationState, setAnimationState] = useState('visible');
    const [animationState2,setAnimationState2] = useState('hiddenin');
    const [animationStateInvite,setAnimationStateInvite] = useState('visible');
    
    const inputRef = useRef(null); // useRef tanımlandı
    
    const [playerName,setPlayerName] = useState("")
    const [playerid, setPlayerId] = useState(0);
    
    useEffect(() => {
        // onAuthStateChanged ile kullanıcıyı kontrol ediyoruz
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try{
                    console.log("user is", user.uid)
                    const playerData = await getPlayer(user.uid)
                    setPlayerId(playerData.id);
                    setPlayerName(playerData.userName);
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
        
        setTimeout(() => setIsInLobby((prevState) => !prevState),500)
    }

    function handleLobbyClick(){
        setIsLobbyClicked((prevState) => !prevState)
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
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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
                                    className='w-full overflow-hidden border-borderRed bg-bgblue bg-opacity-50 text-center text-white font-normal text-base' style={{maxWidth: 408,borderWidth: 1}}>QuickPlay</motion.button>
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
            {isInviteClicked && <InvitePopup handleInviteClick={handleInviteClick} handleAfterInvite={handleAfterInvite}/>}
            {isLobbyClicked && <LobbyPopup handleLobbyClick={handleLobbyClick} handleAfterInvite={handleAfterInvite}/>}
            <AdPlace width={160} height={550} className={"absolute end-6 top-14"} />
            <Footer />
        </div>
    );
}

export default Homepage;
