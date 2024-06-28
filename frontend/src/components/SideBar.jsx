import { useEffect } from "react"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import { useAuth } from "../context/UserContext"
import Dashboard from '../assets/svg/Dashboard.svg'
import Budget from '../assets/svg/Budget.svg'
import Transaction from '../assets/svg/Transaction.svg'
import Settings from '../assets/svg/Setting.svg'
import Logout from '../assets/svg/Logout.svg'

// eslint-disable-next-line react/prop-types
const SideBar = ({ state, setState }) => {
  const {setIsLoggedIn, setAuthUser, authUser} = useAuth()
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryState = params.get('state');
    if (queryState) {
      setState(queryState);
    }
  }, [location]);

  const handleLogOut = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false);
    setAuthUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('isLoggedIn');
    navigate("/")
  }

  const handleClick = (state) => {
    setState(state);
    const url = new URL(window.location);
    url.searchParams.set('state', state);
    window.history.pushState({}, '', url);
  }
  
  return (
    <div className="min-h-screen bg-[#24233F] w-64 p-4 flex flex-col">
      <div className="flex items-center mt-2 mb-6">
        {/* <img src={logo} alt="job-logo" className="h-10 w-auto" /> */}
        <span className="hidden md:block text-white text-2xl font-bold">Budgeti</span>
      </div>
      <hr className="text-[#E6E7E9] w-52 mb-12 border-[1px]" />
      <ul className="flex-grow">
      <li className="mb-12">
          <button onClick={() => handleClick('Expense')} className={`flex flex-row space-x-1 ${state === 'Expense' ? 'text-gray-400' : 'text-[#F2F2F2]'} hover:text-gray-400`}>
            <span><img src={Budget} className="mr-2" /></span>
            Budget
          </button>
        </li>
        <li className="mb-12">
          <button onClick={() => handleClick('Transaction')} className={`flex flex-row space-x-1 ${state === 'Transaction' ? 'text-gray-400' : 'text-[#F2F2F2]'} hover:text-gray-400`}>
            <span><img src={Transaction} className="mr-2" /></span>
            Transaction
          </button>
        </li>
        <li className="mb-12">
          <button onClick={() => handleClick('Category')} className={`flex flex-row space-x-1 ${state === 'Category' ? 'text-gray-400' : 'text-[#F2F2F2]'} hover:text-gray-400`}>
            <span><img src={Dashboard} className="mr-2" /></span>
            Category
          </button>
        </li>
        {/* <li className="mb-12">
          <button onClick={() => handleClick('Setting')} className={`flex flex-row space-x-1 ${state === 'Setting' ? 'text-gray-400' : 'text-[#F2F2F2]'} hover:text-gray-400`}>
            <span><img src={Settings} className="mr-2" /></span>
            Setting
          </button>
        </li> */}
        <li className="mt-24">
          <a href="#logout" className="flex flex-row space-x-1 text-red-400" onClick={handleLogOut}>
            <span><img src={Logout} className="mr-2" /></span>
            Logout
          </a>
        </li>
      </ul>
      <div className="mt-auto flex flex-row items-center">
        <NavLink to="/profile-picture">
          <img src="path/to/profile-icon.jpg" alt="Profile Icon" className="w-10 h-10 rounded-full mr-4 bg-slate-700" />
        </NavLink>
        <span className="text-xl font-bold text-white">{authUser.username}</span>
      </div>
    </div>

  )
}

export default SideBar