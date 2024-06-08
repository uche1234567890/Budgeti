import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const url = 'http://localhost:6000/api'

const EmailConfirmation = () => {
    const [status, setStatus] = useState('Verifying...');
    const { token } = useParams();
    console.log(token)

    useEffect(() => {
        const verifyEmail = async () => {
          if (token) {
            await axios.get(`${url}/user/verify-email/${token}`).then(response => {
                console.log(response)
                toast.success("Sign In Successful")
              }).catch(err => {
                toast.error(err.response.data.message)
              })
            setTimeout(() => {
              setStatus('Email verified successfully!');
            }, 2000);
          } else {
            setStatus('Invalid verification link.');
          }
        };
    
        verifyEmail();
      }, [token]);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  )
}

export default EmailConfirmation