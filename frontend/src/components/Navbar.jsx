import { NavLink } from "react-router-dom"
import logo from '../assets/react.svg'
import { useAuth } from "../context/UserContext"

const Navbar = () => {
    const {isLoggedIn} = useAuth()
  return (
    <header className="bg-[#24233F] shadow-md py-3">
        <div className="flex justify-around items-center max-w-6xl mx-auto">
            <NavLink to='/' className="flex justify-around space-x-2">
                {/* <img src={logo} alt="job-logo" className="h-10 w-auto" /> */}
                <span className="hidden md:block text-white text-2xl font-bold">Budgeti</span>
            </NavLink>
            <ul className='flex gap-4'>
                <NavLink to='/profile'>
                    {isLoggedIn ? (
                        <NavLink to='/profile'>
                            <img className='rounded-full h-7 w-7 object-cover' src="" alt='Profile'/>
                        </NavLink>
                    ) : (
                        <div className="flex justify-around space-x-4">
                            <NavLink to='/sign-in'>
                                <li className='text-white px-4 py-1 rounded-2xl bg-blue-500 cursor-pointer hover:bg-white hover:border-blue-500 hover:text-blue-500'>Log In</li>
                            </NavLink>
                            <NavLink to="/sign-up">
                                <li className='text-white px-4 py-1 rounded-2xl bg-blue-500 cursor-pointer hover:bg-white hover:border-blue-500 hover:text-blue-500'>Sign Up</li>
                            </NavLink>
                        </div>
                    )
                    }
                </NavLink>              
            </ul>
        </div>
    </header>
  )
}

export default Navbar