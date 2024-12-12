import React, { useEffect, useState } from 'react'
import { checkPlayerJoin, createEmpthyLobby, deleteLobbyRef, joinToTheLobby, searchWaitingLobby ,listenToLobbyStatusForMatchMaking, getUserDataByUid  } from '../FirebaseFunctions';
import { useNavigate , useLocation } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import AdPlace from '../components/AdPlace';
import { Footer } from '../components/Footer';
import SwordFight from '../components/scgIcons/SwordFight';
import Brain from '../components/scgIcons/Brain';


const SearchingPage = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const playerUid = location.state?.playerUid;
    const playerName = location.state?.playerName;
    const playerId = location.state?.playerId;

    const [player,setPlayer] = useState({ Name : playerName , Id : playerId});
    const [opponent,setOpponent] = useState({ Name: 'Opponent is a mistery' , Id : 'for now'});
    const [searchingState,setSearchingState] = useState('loading');

    useEffect(() => {
        if (!playerName){
            console.error('There is no player Data', playerName , playerId , playerUid)
            navigate('/');
        } 
    },[]);
    
    
    useEffect(() => {
        async function searchLobby(){
            setSearchingState('searching lobby');
            
            const result = await searchWaitingLobby();
            
            console.log('success',result.success);
            console.log('lobbyUid', result.lobbyDocUid);
            
            if (result.success){
                setSearchingState('found lobby. joining...');
                const res = await joinToTheLobby(result.lobbyDocUid);
                console.log('joining the lobby ',res.success);
                setSearchingState('Lobby Joined');
                console.log('lobbyData :', res.lobbyData);
                console.log('playerUid :', res.playerUid);
                console.log('OpponnentUid :', res.lobbyData.player1);
                const opponentData = await getUserDataByUid(res.lobbyData.player1);
                setOpponent({Name : opponentData.userName , Id : opponentData.id});
                console.log(opponent);
                setSearchingState('Lobby Joined. Starting Game');
                // navigate("/LoadingPage", { state: { playerUid: playerUid, lobbyData: lobbyData } })
                
            }else {
                console.log('cannot join the lobby');
                setSearchingState('Could not found any waiting lobby,Creating one');
                const result = await createEmpthyLobby(); 
                console.log(result.success);
                console.log('lobby ref ', result.lobbyRefUid);
                console.log('lobbyUid', result.lobbyUid);
                setSearchingState('Lobby created, waiting player...');
                const res = await waitPlayer(result.lobbyUid,result.lobbyRefUid,0);
                const joinedPlayer = await getUserDataByUid(res.joinedPlayer);
                setOpponent({ Name : joinedPlayer.userName, Id : joinedPlayer.id});
                setSearchingState('Player found!. Starting Game');
                console.log('Waitplayer success :', res.success);
            }
        };

        searchLobby();
    },[]);

    async function waitPlayer(lobbyUid,lobbyRefUid,tryCount) {
        if (tryCount >= 3 ){
            console.error('three try has failed,searchiong shuting down');
            return { success : false , message : 'tryed 3 times no succes'};
        }

        if (!lobbyUid && !lobbyRefUid){
            console.error('Invalid lobbyUid or lobbyRefUid');
            return { success : false , message : 'Invalid lobbyUid or lobbyRefUid'};
        }

        try{
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout waiting for player')), 30000);
            });
    
            const lobbyStatus = await Promise.race([
                listenToLobbyStatusForMatchMaking(lobbyUid, 'foundPlayer'),
                timeoutPromise
            ]);
    
            console.log('Player found, lobby status:', lobbyStatus);

            if (lobbyStatus === 'foundPlayer'){
                const playerJoinSuccess = await checkPlayerJoin(lobbyUid);

                if (!playerJoinSuccess.success){
                    console.error('Player is not in lobby');
                    return await waitPlayer(lobbyUid,lobbyRefUid,tryCount + 1);
                }

                console.log('playerJoinSuccess', playerJoinSuccess);

                const deleteResult = await deleteLobbyRef(lobbyRefUid);

                if (!deleteResult.success){
                    console.error("Lobby ref can not deleted",deleteResult.data.message);
                    return await waitPlayer(lobbyUid,lobbyRefUid,tryCount + 1);
                }

                console.log('deleteResult',deleteResult.success)

                console.log('Lobby Ref succesfully deleted');
                return { success : true , message : 'transaction succesfully complete', joinedPlayer : playerJoinSuccess.player};
            }

        } catch (err){
            console.error('Something went wrong with transaction', err);
            return await waitPlayer(lobbyUid,lobbyRefUid,tryCount + 1);
        }
    }


  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <div className='absolute top-36 font-AlfaSlabOne text-5xl text-white z-10' style={{letterSpacing : 6}}>Matching Energy...</div>
        <div className='absolute top-48 text-2xl text-white z-10'>{searchingState}</div>
        <div className='flex w-full h-full gap-8 justify-center mt-12'> 
            <AdPlace width={181} height={550} className={'mx-6'}/>
            <div className='relative flex gap-20 justify-center self-center top-14 z-10'>
                <PlayerCard player={player}/>
                <SwordFight className='self-center' />
                <PlayerCard player={opponent}/>
            </div>
            <AdPlace width={181} height={550} className={'mx-6'}/>
        </div>
        <Brain className='absolute self-center'/>
        <Footer/>
    </div>
  )
}

export default SearchingPage;