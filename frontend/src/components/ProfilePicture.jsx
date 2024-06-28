import {useState, useRef, useEffect} from 'react'
import { toast } from 'react-toastify';
import { useAuth } from '../context/UserContext';
import axios from 'axios';
import Navbar from './Navbar';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"
import { useNavigate } from 'react-router-dom';

const devApiUrl = 'http://localhost:8000';

const ProfilePicture = () => {
    const fileRef = useRef(null)
    const { authUser, setAuthUser } = useAuth()
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(undefined)
    const [filePercent, setFilePercent] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [imageUrl, setImageUrl] = useState("");
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const navigate = useNavigate()

    useEffect(() => {
        if(file){
          handleFileUpload(file)
        }
      }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, `profile/${fileName}`)
    
        const uploadTask = uploadBytesResumable(storageRef, file)
    
        uploadTask.on('state_changed', (snapshot) =>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setFilePercent(Math.round(progress))
        },() => {
          setFileUploadError(true)
        },()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUrl(downloadUrl)
          })
        })
      }

      const handleUpload = async () => {
        console.log(imageUrl)
        if(imageUrl){
            await axios.post(`${devApiUrl}/api/user/profile-picture`, {imageUrl}).then(response => {
                console.log(response.data.url)
                toast.success("Image Upload Successful")
                let savedUser = localStorage.getItem('authUser');
                savedUser = JSON.parse(savedUser)
                savedUser.profilePicture = response.data.url
                setAuthUser(savedUser)
                navigate("/dashboard")
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        }else{
            toast.error("Invalid Image")
        }
      }
  return (
    <>
        <Navbar />

        <div className="p-3 max-w-lg mx-auto h-screen my-12">
            <h2 className="text-2xl font-bold mb-4">Update Profile Picture</h2>
            <input type="file" accept="image/*" ref={fileRef}  onChange={(e) => setFile(e.target.files[0])} className="mb-4" hidden/>
            <img onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover items-center bg-slate-800 cursor-pointer my-2 self-center" src={imageUrl || authUser.profilePicture} alt="Profile Image" />
            <button onClick={handleUpload} className="px-4 py-2 rounded-lg bg-indigo-600 items-center text-white" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Image'}
            </button>
        </div>
    </>
  )
}

export default ProfilePicture