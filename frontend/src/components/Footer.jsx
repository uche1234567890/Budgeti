import { NavLink } from "react-router-dom"
import logo from '../assets/react.svg'

const Footer = () => {
  return (
    <footer className='bg-[#24233F] mt-auto'>
        <div className="container max-w-6xl py-10 mx-auto">
          <div className="flex flex-col items-center mb-8 space-y-6 md:flex-row md:space-y-0 md:justify-between md:items-start">
            <div className="flex flex-col items-center space-y-8 md:items-start md:space-y-4">
              <NavLink to='/' className="flex flex-col md:flex-row space-x-0 md:space-x-4 h-8">
                <span className="hidden md:block text-white text-2xl font-bold">Budgeti</span>
                </NavLink>
            </div>

            <div className='flex flex-col items-start justify-between space-y-4 text-gray-500'>
              <div className="font-bold">
                &copy; 2024 Budgeti. All Rights Reserved
              </div>

              
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer