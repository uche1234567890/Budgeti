import { useEffect, useState } from 'react';
import { handleDecrypt } from '../utils/decryptToken';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

//const apiUrl = "https://testenv-budgetapp-api.onrender.com";
const devApiUrl = 'https://budgeti-api.onrender.com';

const EmailConfirmation = () => {
    const [status, setStatus] = useState('Verifying...');
    const { token } = useParams();
    const decryptedToken = handleDecrypt(token.split('&key=')[0], token.split('&key=')[1])
    console.log(decryptedToken.split("+"))
    const tokenValue = decryptedToken.split("+")[0]
    const userValue = decryptedToken.split("+")[1]

     useEffect(() => {
         const verifyEmail = async () => {
           if (tokenValue) {
             await axios.get(`${devApiUrl}/api/auth/verify-email/${tokenValue}`).then(response => {
                 console.log(response)
                 setStatus("Verification Complete")
                 toast.success("Email Verified Successfully")
               }).catch(err => {
                 toast.error(err.response.data.message)
               })
           } else {
             setStatus('Invalid verification link.');
           }
         };
    
         verifyEmail();
       }, [tokenValue]);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
        <p>{status}</p>
        {status == "Verification Complete" && 
          <>
            <p>Hello {userValue}, Your email has been verified please click on the button provided below to login</p>
            <Link to="/sign-in" className='my-8 px-3 py-2 bg-slate-500 rounded-lg'>Log In</Link>
          </>
        }
      </div>
    </div>
  )
}

export default EmailConfirmation