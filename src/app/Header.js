'use client'
import React from 'react'
import LoginLinks from '@/app/LoginLinks'

const Header = () => {
    return (
      <header className="relative z-10 w-full flex justify-between items-center px-6 py-4 bg-black/70 backdrop-blur-lg">
        <h2 className="text-xl md:text-xl font-bold bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg">
          TechConnectMalawi
        </h2>
        <LoginLinks />
      </header>
    )
  }
  
  export default Header
  
