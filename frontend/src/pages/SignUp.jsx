import { NavLink, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash} from 'react-icons/fa'
import { useState } from "react"
import { toast } from "react-toastify"

const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';



const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {register, handleSubmit, formState: {errors}, watch} = useForm()
    const password = watch("password");

    const navigate = useNavigate()

    const submitForm = async (data) => {
      const { firstname, lastname, username, email, password} = data
      console.log(data)
      await axios.post(`${devApiUrl}/api/auth/signup`, {firstname, lastname, username, email, password}).then(response => {
        console.log(response)
        toast.success("Sign In Successful, Checkyour email for a the verification link to proceed")
        //navigate("/sign-in")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
     
    }
  return (
    <div className="p-3 max-w-lg mx-auto">
        <h2 className="text-3xl text-center font-semibold my-7">Sign Up</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>
            <input type="text" name="firstname" id="firstname" placeholder="Firstname" className="border p-3 rounded-lg" 
            {...register("firstname", {required: "First Name is required.", maxLength: { value: 20, message: "Firstname should have a max length of 20 character"}})}/>
            {errors.firstname && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.firstname?.message}</p>)}

            <input type="text" name="lastname" id="lastname" placeholder="Lastname" className="border p-3 rounded-lg" 
            {...register("lastname", {required: "Last Name is required.", maxLength: { value: 20, message: "Lastname should have a max length of 20 character"}})}/>
            {errors.lastname && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.lastname?.message}</p>)}

            <input type="text" name="username" id="username" placeholder="Username" className="border p-3 rounded-lg" 
            {...register("username", {required: "Username is required.", maxLength: { value: 40, message: "Username should have a max length of 40 character"}})}/>
            {errors.username && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.username?.message}</p>)}

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

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">Sign Up</button>
        </form>
        <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <NavLink to="/sign-in">
                <span className="text-blue-700">Sign In</span>
            </NavLink>
        </div>
    </div>
  )
}

export default SignUp