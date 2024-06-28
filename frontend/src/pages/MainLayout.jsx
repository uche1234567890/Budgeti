import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import { useAuth } from "../context/UserContext"
import { ToastContainer } from "react-toastify"

const MainLayout = () => {
  const {isLoggedIn} = useAuth()
  return (
    <div className="min-h-screen">
        {!isLoggedIn && <Navbar />}
        <Outlet />
        {!isLoggedIn && <Footer />}
        <ToastContainer/>
    </div>
  )
}

export default MainLayout