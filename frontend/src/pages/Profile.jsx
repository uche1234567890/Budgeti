import { useState, useRef } from "react"
import { useAuth } from "../context/UserContext"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "react-toastify";

//const apiUrl = import.meta.env.VITE_API_URL;
const devApiUrl = 'https://budgeti-api.onrender.com';

const Profile = () => {
  const fileRef = useRef(null)
  const { authUser, setAuthUser } = useAuth()
  const [firstName, setFirstName] = useState(authUser.firstname)
  const [lastName, setLastName] = useState(authUser.lastname)
  const [userName, setUserName] = useState(authUser.username)
  const [email, setEmail] = useState(authUser.email)
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const updateData = {username: userName, firstname: firstName, lastename: lastName, email}
    await axios.patch(`${devApiUrl}/api/user/edit/${authUser._id}`, updateData).then(response => {
      console.log(response)
      setAuthUser(response.user)
      toast.success(response.message)
      navigate("/")
  }).catch(err => {
      toast.error(err.response.data.message)
  })
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="firstName" className="text-lg font-semibold">First Name</label>
        <input type="text" className="p-3 border rounded-lg" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label htmlFor="lastName" className="text-lg font-semibold">Last Name</label>
        <input type="text" className="p-3 border rounded-lg" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label htmlFor="userName" className="text-lg font-semibold">UserName</label>
        <input type="text" className="p-3 border rounded-lg" name="userName" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />

        <label htmlFor="email" className="text-lg font-semibold">Email Address</label>
        <input type="email" className="p-3 border rounded-lg" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <button className="p-3 bg-blue-500 rounded-lg text-white hover:opacity-90 disabled:opacity-80">Update Profile</button>
      </form>
      <div className="mt-5">
          {/* <span className="text-red-700 cursor-pointer" onClick={signUserOut}>Sign Out</span> */}
      </div>
    </div>
  )
}

export default Profile