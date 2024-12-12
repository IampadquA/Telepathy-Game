import React, { useEffect, useState } from 'react'
import img from "../assets/ProfilePictures/cat_2.jpeg"

const PlayerCard = ({ player }) => {
  const [playerName, setPlayerName] = useState(player?.Name || 'Unknown Player');
  const [playerTag, setPlayerTag] = useState(player?.Id || 'No ID');

  useEffect(() => {
      if (player) {
          setPlayerName(player.Name);
          setPlayerTag(player.Id);
      }
  }, [player]);  

  return (
    <div className='relative flex flex-col gap-4 w-full h-full items-center p-6 border-2 bg-Design-Button-blue border-Design-red rounded-lg font-Bungee' style={{ maxWidth : 323, maxHeight : 344}}>
        <div className='w-36 h-36 rounded-full border-2 mb-8' style={{ borderColor : '#6A363B'}}>
            <img src={img} className='overflow-hidden rounded-full' />
        </div>
        <h2 className=' text-2xl text-center text-Design-Button-white'>{playerName}</h2>
        <h3 className='text-sm text-center text-Design-Button-red mb-8'>{playerTag}</h3>
    </div>
  )
}

export default PlayerCard;