import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className='absolute bottom-0 flex flex-row w-full p-4'>
        <Link className='text-base text-txtthidary'>Coded by<div className='text-base text-txtsecondary inline-block'>IampadquA</div></Link>
        <nav className="relative flex gap-10 ml-auto mr-2">
            <Link className='text-sm text-txtthidary'>Privacy Policy</Link>
            <Link className='text-sm text-txtthidary'>Terms Of Use</Link>
        </nav>
    </footer>
  )
}