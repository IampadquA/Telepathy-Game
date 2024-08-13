import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import Button from '../components/Button';
import AdPlace from '../components/AdPlace';
import { Footer } from '../components/Footer';
import { useState } from 'react';
import { motion } from 'framer-motion';


const InvertoryPage = () => {
  const inventorys = ['Default', 'Emoji', 'Minecraft'];
  const [navbarSelect, setNavbarSelect] = useState('');
  const [navbaranimete,setNavbarAnimate] = useState("navbarhrinital");

  const [subInventoryCategory,setSubInventoryCategory] = useState("Blocks")

  const handleOptionChange = (event) => {
    setNavbarSelect(event.target.value);
    
    if (event.target.value === 'Default') {
      setNavbarAnimate('navbarhrinitial');
    } else if (event.target.value === 'Emoji') {
      setNavbarAnimate('navbarhrfirst');
    } else if (event.target.value === 'Minecraft') {
      setNavbarAnimate('navbarhrthird');
    }
  };
  
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
        <div className='relative bg-opacity-30 bg-bgdarkerdarkerblue border-2 my-8 p-4 ' style={{width : 920,height : 380, borderRadius: 25 , borderColor : '#643236', backdropFilter: 'blur(20px)'}}>
          <h2 className='mx-3 mb-3 text-Error-text '>{subInventoryCategory}</h2>
          <div className='relative w-full h-full max-h-60 bg-gray-600 my-3'>
          <div className='absolute border-2 w-20 rotate-90 -left-6 top-16'/>

          </div>
          <div className='flex w-full'>
            <Button className="relative w-24 h-7 ml-auto mr- text-sm " buttonText="Select"/>
          </div>
          <div className='flex justify-around w-full text-Error-text'>
            <button>
              <FaArrowRight className='rotate-180'/>
            </button>
            <button>
              <FaArrowRight/>
            </button>
          </div>
        </div>
      </div>
      <AdPlace width={160} height={550} className={"absolute end-6 top-14"} />
      <AdPlace width={100} height={784} className={"absolute top-52 left-1/2 rotate-90"}/>
      <AdPlace width={220} height={220} className={"absolute left-5 bottom-32"} />
      <Footer/>
    </div>
  )
}

export default InvertoryPage