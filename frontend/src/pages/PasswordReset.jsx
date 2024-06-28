/* eslint-disable no-unused-vars */
import {useState} from 'react'
import { useForm } from 'react-hook-form'
import { handleDecrypt } from '../utils/decryptToken'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

//const apiUrl = import.meta.env.VITE_API_URL;
const devApiUrl = 'https://budgeti-efsd.onrender.com';

const PasswordReset = () => {
    const {register, handleSubmit, watch, formState: {errors}} = useForm()
    const password = watch("password");
    const navigate = useNavigate()
    const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const decryptedToken = handleDecrypt(token.split('&key=')[0], token.split('&key=')[1])
    const tokenValue = decryptedToken.split("+")[0]
    const userEmail= decryptedToken.split("+")[1]

    const submitForm = async (data) => {
        const {email, password} = data
      console.log(data)
      await axios.post(`${devApiUrl}/api/auth/reset-password`, {email: userEmail, token: tokenValue, newPassword: password }).then(response => {
        console.log(response)
        toast.success("Sign In Successful")
        navigate("/sign-in")
      }).catch(err => {
        console.log(err)
        toast.error(err.response.data.error)
      })
     
    }
  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
        <h2 className="text-3xl text-center font-semibold my-7">Reset Your Password</h2>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit((data) => submitForm(data))}>
        <input type="email" name="email" id="email" placeholder="Email Address" className="border p-3 rounded-lg" 
            {...register("email", {required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email Address pattern does not match"} })} />
            {errors.email && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.email?.message}</p>)}
        <div className="relative border p-3 rounded-lg bg-white">
                <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder="Password" className="w-100 border-none focus:outline-none" 
                {...register("password", {required: "Password is required", pattern: {value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: "Password must contain one uppercase, one lowercase, one number and a special character"}})} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            {errors.password && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.password?.message}.</p>)}

            <div className="relative border p-3 rounded-lg bg-white">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" className="w-100 border-none focus:outline-none" 
                {...register("confirmPassword", {required: "Confirm your password.", validate: value => value == password || "Passwords do not match"})} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            </div>
            {errors.confirmPassword && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.confirmPassword?.message}</p>)}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Reset Password
          </button>
        </form>
    </div>
  )
}

export default PasswordReset