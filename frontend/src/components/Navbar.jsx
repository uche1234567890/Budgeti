import { NavLink } from "react-router-dom"
import logo from '../assets/react.svg'
import { useState } from "react"
import { useAuth } from "../context/UserContext"

const Navbar = () => {
    const {isLoggedIn} = useAuth()
  return (
    <header className="bg-slate-200 shadow-md py-3">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <NavLink to='/'>
                <img src={logo} alt="job-logo" className="h-10 w-auto" />
                <span className="hidden md:block text-black text-2xl font-bold">Budgeting App</span>
            </NavLink>
            <ul className='flex gap-4'>
                <NavLink to='/'>
                    <li className='text-slate-700 cursor-pointer hidden hover:underline sm:inline'>Home</li>
                </NavLink>
                <NavLink to='/about'>
                    <li className='text-slate-700 cursor-pointer hidden hover:underline sm:inline'>About</li>
                </NavLink>
                <NavLink to='/profile'>
                    {isLoggedIn ? (
                        <img className='rounded-full h-7 w-7 object-cover' src="" alt='Profile'/>
                    ) : (
                        <li className='text-slate-700 cursor-pointer hover:underline'>Sign In</li>
                    )
                    }
                </NavLink>              
            </ul>
        </div>
    </header>
  )
}

export default Navbar