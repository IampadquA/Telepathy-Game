import React from 'react'
import { motion } from 'framer-motion'

import Inventory from '../components/Inventory'
import { Footer } from '../components/Footer'
import ItemHistoryBox from '../components/ItemHistoryBox'

import TelepathIcon from '../components/scgIcons/TelepathIcon'
import Brain from '../components/scgIcons/Brain'


const TelepathyPage = () => {
    return (
        <div className='relative flex flex-col items-center w-full'>
            <div className='relative w-full h-full flex self-center gap-28 mt-28' style={{ maxWidth : 1248 , maxHeight : 312}}>
                <div className='w-full h-full flex flex-col gap-9 items-center' style={{maxWidth : 576, maxHeight : 304}}>
                    <TelepathIcon selected="thinkerTelepath" />
                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex flex-col text-center font-Bungee gap-2'>
                            <h2 className='text-2xl text-Design-Button-white'>Husametttin Necmiye</h2>
                            <h3 className='text-sm text-Design-Button-red'>Mastermind</h3>
                        </div>
                        <ItemHistoryBox></ItemHistoryBox>
                    </div>
                </div>
                <div className='w-full h-full flex flex-col gap-9 items-center' style={{maxWidth : 576, maxHeight : 304}}>
                <TelepathIcon selected="happyTelepath" />
                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex flex-col text-center font-Bungee gap-2'>
                            <h2 className='text-2xl text-Design-Button-white'>Niyazimiye Erbaktiran</h2>
                            <h3 className='text-sm text-Design-Button-red'>Rookie</h3>
                        </div>
                        <ItemHistoryBox></ItemHistoryBox>
                    </div>
                </div>
                <div className='absolute flex justify-center font-Orbitron text-7xl text-white inset-0 '>00 : 30</div>
            </div>
            <p className='max-w-2xl text-Design-Button-white font-Bungee text-base text-center mt-12 content-center justify-center'> Some Usefultips for current state</p>
            <Inventory selectedInventory="Emojis" />
            <motion.button className='relative font-Bungee text-5xl text-Design-Button-white mb-32 mt-8'
                            whileHover={{ scale : 1.1 , textShadow: '15px 0px 30px rgba(136, 68, 73, 1), -15px 0px 30px rgba(136, 68, 73, 1), 15px 0px 0px rgba(136, 68, 73, 1) , -15px 0px 0px rgba(136, 68, 73, 1)'}}
                            whileTap={ {color : 'rgba(136, 68, 73, 1)' ,textShadow: '15px 0px 30px rgba(0, 0, 0, 1), -15px 0px 30px rgba(0,0,0,1), 15px 0px 0px rgba(0,0,0,1) , -15px 0px 0px rgba(0,0,0,1)'}}
                            transition={{
                                whileTap: { duration: 0.1 }, 
                              }}
            >Select</motion.button>
            <Brain className='absolute self-center top-24 -z-10'/>
            <Footer />
        </div>
    )
}

export default TelepathyPage 