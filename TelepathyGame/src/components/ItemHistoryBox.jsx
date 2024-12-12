import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ItemHistoryBox = () => {
  const items = [{ id: 'I0001', name: 'CryEmoji', imgRef: '../assets/react.svg', subCategory: ['Face Emojis'], description: 'Some description for item ' },
                  { id: 'selected', imgRef: '../assets/react.svg' },
                  {id : 'empty'},
                  {id : 'empty'},
                  {id : 'empty'},
                  {id : 'empty'},]

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className='relative w-full h-full grid grid-cols-6  border-2 bg-Design-red border-black rounded-lg' style={{ maxWidth : 574 , height : 64}}>      
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className={`col-span-1 relative ${index === 0 ? 'border-none' : 'content-center justify-center'}`} 
          style={index !== 0 ? { position: 'relative' } : { alignContent : 'center'}}
        >
          {index !== 0 && (
            <span className=' absolute left-0 top-4 bottom-4 border-2 bg-white'/>
          )}

          {item.id.startsWith('I') && (
            <div className='flex flex-col justify-items-center items-center'>
              <div className='w-full max-w-16 justify-center self-center z-20 border-green-300'
                  onMouseEnter={() => setHoveredIndex(index)} 
                  onMouseLeave={() => setHoveredIndex(null)}
              >
                <img src={item.imgRef} alt={item.name}/>
              </div>
              <motion.div className='absolute p-4 flex flex-col top-full mt-2 -left-16 w-56 h-fit bg-bgdarkerdarkerblue border-2 border-Design-Button-red rounded-lg font-Montserrat cursor-default overflow-clip' style={{ transformOrigin : 'top'}}
                          initial={{ opacity : 0, maxHeight : 0 }}
                          animate={{ opacity : hoveredIndex === index ? 1 : 0 , maxHeight : hoveredIndex === index ? 500 : 0}}
                          transition={{ opacity : {duration : 0.3},
                                        maxHeight : {duration : 2} }}
              >
                <h1 className='text-xs' style={{ color : '#F4CACB'}}>Name : <div className=' inline-block text-Design-Button-white'>{item.name}</div></h1>
                <h1 className='text-xs' style={{ color : '#F4CACB'}}>Category : <div className=' inline-block text-Design-Button-white' >{item.subCategory}</div></h1>
                <h2 className='text-xs ' style={{ color : '#F4CACB'}}>Description : <p className='inline-block' style={{ color : '#CDCBCB'}}>{item.description}</p></h2>
              </motion.div>
            </div>
          )}

          {item.id === 'selected' && <div className='flex flex-col justify-items-center '>
            
            </div>}

          {item.id === 'empty' && (
            <div className='flex flex-col items-center'>
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.9998 0.666626C6.63984 0.666626 0.666504 6.63996 0.666504 14C0.666504 21.36 6.63984 27.3333 13.9998 27.3333C21.3598 27.3333 27.3332 21.36 27.3332 14C27.3332 6.63996 21.3598 0.666626 13.9998 0.666626ZM7.4265 22.3733C7.99984 21.1733 11.4932 20 13.9998 20C16.5065 20 20.0132 21.1733 20.5732 22.3733C18.7598 23.8133 16.4798 24.6666 13.9998 24.6666C11.5198 24.6666 9.23984 23.8133 7.4265 22.3733ZM22.4798 20.44C20.5732 18.12 15.9465 17.3333 13.9998 17.3333C12.0532 17.3333 7.4265 18.12 5.51984 20.44C4.15984 18.6533 3.33317 16.4266 3.33317 14C3.33317 8.11996 8.11984 3.33329 13.9998 3.33329C19.8798 3.33329 24.6665 8.11996 24.6665 14C24.6665 16.4266 23.8398 18.6533 22.4798 20.44ZM13.9998 5.99996C11.4132 5.99996 9.33317 8.07996 9.33317 10.6666C9.33317 13.2533 11.4132 15.3333 13.9998 15.3333C16.5865 15.3333 18.6665 13.2533 18.6665 10.6666C18.6665 8.07996 16.5865 5.99996 13.9998 5.99996ZM13.9998 12.6666C12.8932 12.6666 11.9998 11.7733 11.9998 10.6666C11.9998 9.55996 12.8932 8.66663 13.9998 8.66663C15.1065 8.66663 15.9998 9.55996 15.9998 10.6666C15.9998 11.7733 15.1065 12.6666 13.9998 12.6666Z"
                  fill="#F6F6F6"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemHistoryBox