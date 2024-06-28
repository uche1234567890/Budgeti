import { useState } from "react"
import { useForm } from "react-hook-form"
import { NavLink, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash} from 'react-icons/fa'
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "../context/UserContext"

//const apiUrl = import.meta.env.VITE_API_URL;
const devApiUrl = 'https://budgeti-api.onrender.com';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { setAuthUser, setIsLoggedIn} = useAuth()
    const {register, handleSubmit, formState: {errors}} = useForm()

    const navigate = useNavigate()

    const submitForm = async (data) => {
        const {email, password} = data
        await axios.post(`${devApiUrl}/api/auth/login`, { email, password}).then(response => {
            localStorage.setItem("token", response.data.token)
            toast.success("Sign In Successful")
            setIsLoggedIn(true)
            setAuthUser(response.data.user)
            navigate("/dashboard")
          }).catch(err => {
            toast.error(err.response.data.error)
          })
      }

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
        <h2 className="text-3xl text-center font-semibold my-7">Sign In</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>

            <input type="email" name="email" id="email" placeholder="Email Address" className="border p-3 rounded-lg" 
            {...register("email", {required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email Address pattern does not match"} })} />
            {errors.email && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.email.message}</p>)}

            <div className="relative border p-3 rounded-lg bg-white">
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" placeholder="Password" className="focus:outline-none w-100" 
                {...register("password", {required: "Password is required"})}/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye className="text-black" /> : <FaEyeSlash className="text-black"/>}
                </div>
            </div>
            {errors.password && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.password.message}.</p>)}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">Log In</button>
        </form>
        <div className="flex justify-between gap-2 mt-5">
            <NavLink to="/sign-up">
                <span className="text-blue-700">Sign Up</span>
            </NavLink>
            <NavLink to="/forgot-password">
                <span className="text-red-500">Forgot Password?</span>
            </NavLink>
        </div>
    </div>
  )
}

export default SignIn