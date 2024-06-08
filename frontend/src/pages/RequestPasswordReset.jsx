import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-toastify"

const url = 'http://localhost:6000/api'

const RequestPasswordReset = () => {
    const {register, handleSubmit, formState: {errors}} = useForm()

    const submitForm = async (data) => {
        const {email} = data
      console.log(data)
      await axios.post(`${url}/user/initiate-password-reset`, {email}).then(response => {
        console.log(response)
        toast.success("Sign In Successful")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
     
    }
  return (
      <div className="p-3 max-w-lg mx-auto">
        <h2 className="text-3xl text-center font-semibold my-7">Reset Your Password</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>
            <input type="email" name="email" id="email" placeholder="Email Address" className="border p-3 rounded-lg" 
            {...register("email", {required: "Email Address is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email Address pattern does not match"} })} />
            {errors.email && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.email?.message}</p>)}
          <button type="submit"className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Send Reset Link
          </button>
        </form>
      </div>
  )
}

export default RequestPasswordReset