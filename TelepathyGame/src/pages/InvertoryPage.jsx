import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import AdPlace from '../components/AdPlace';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import Inventory from '../components/Inventory';
import Button from '../components/Button';
import InviteRequestPopup from '../components/InviteRequestPopup';


const InvertoryPage = () => {
  const inventorys = ['Default', 'Emoji', 'Minecraft'];
  const [navbarSelect, setNavbarSelect] = useState('Default');
  const [navbaranimete,setNavbarAnimate] = useState("navbarhrinital");
  
  const [selected,SetSelected] = useState("Default")
  const [isSelected,SetIsSelected] = useState(true)

  const [isInvited,setIsInvited] = useState(false);

  function handleInviteReq(){
    setIsInvited((prevState) => !prevState);
}

  const handleOptionChange = (event) => {
    setNavbarSelect(event.target.value);
    
    if (event.target.value === 'Default') {
      setNavbarAnimate('navbarhrinitial');
      event.target.value === selected ? SetIsSelected(true) : SetIsSelected(false)
    } else if (event.target.value === 'Emoji') {
      setNavbarAnimate('navbarhrfirst');
      event.target.value === selected ? SetIsSelected(true) : SetIsSelected(false)
    } else if (event.target.value === 'Minecraft') {
      setNavbarAnimate('navbarhrthird');
      event.target.value === selected ? SetIsSelected(true) : SetIsSelected(false)
    }
  };
  
  const handleSelectClick = () => {
    SetSelected(navbarSelect);
    SetIsSelected(true);
  }
  
  const variants = {
    navbarhrinitial : {width: 70 ,x : 4 },
    navbarhrfirst : {width : 60, x : 110 },
    navbarhrthird : {width : 90, x : 203 }
  }


  return (
    <div className='flex flex-col'>
      <header className='relative flex gap-16 my-8 mx-14'>
        <h1 className='text-txtwh font-bold'>Telepathy Game</h1>
        <Link to="/" className='text-txtsecondary ml-2'>Home</Link>
      </header>
      <div className='relative self-center' style={{width : 920 , height : 360}}>
        <div className='flex flex-row gap-10 mt-3'>
        {inventorys.map((inventory, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value={inventory}
                checked={navbarSelect === inventory}
                onChange={handleOptionChange}
                className="hidden" // Radyo butonunu gizle
              />
              <span className={`${navbarSelect === inventory ? 'text-txtwh' : 'text-txtsecondary'}`}>
                {inventory}
              </span>
            </label>
          ))}
        <motion.hr 
        variants={variants}
        initial = "navbarhrinitial"
        animate = {navbaranimete}
        className=' absolute mt-6 border-2 '/>
        </div>
        <Inventory selectedInventory={navbarSelect}/>
        <div className={`relative flex w-full -top-24 right-10 ${isSelected ? "opacity-10" : "opacity-100"}`}>
          <Button className="relative w-24 h-7 ml-auto text-sm " buttonText="Select" onClick={handleSelectClick}/>
        </div>
      {isInvited && <InviteRequestPopup handleInviteReq={handleInviteReq} className={'left-1/4'}/>} 
      </div>
      <AdPlace width={160} height={550} className={"absolute end-6 top-14"} />
      <AdPlace width={100} height={784} className={"absolute top-52 left-1/2 rotate-90"}/>
      <AdPlace width={220} height={220} className={"absolute left-5 bottom-32"} />
      <Footer/>
    </div>
  )
}

export default InvertoryPage