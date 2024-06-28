import {useState, useRef} from 'react'
import { toast } from 'react-toastify';
import { useAuth } from '../context/UserContext';
import axios from 'axios';
import Navbar from './Navbar';

const devApiUrl = 'https://budgeti-api.onrender.com';

const ProfilePicture = () => {
    const fileRef = useRef(null)
    const { authUser } = useAuth()
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    
    const handleUpload = async () => {
        if (!image) {
            toast.error("Please select an image to upload");
            return;
        }
    
        setLoading(true);
    
        const formData = new FormData();
        formData.append('file', image);
        // formData.append('Profile Image', 'Profile Image');
    
        try {
            const response = await axios.patch(
                `${devApiUrl}/api/user/profile-picture`, 
                formData
            );
    
            setImageUrl(response.data.secure_url);
            toast.error('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
        } finally {
            setLoading(false);
        }
    };
  return (
    <>
        <Navbar />

        <div className="p-3 max-w-lg mx-auto h-screen my-12">
            <h2 className="text-2xl font-bold mb-4">Update Profile Picture</h2>
            <input type="file" accept="image/*" ref={fileRef}  onChange={handleImageChange} className="mb-4" hidden/>
            <img onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover items-center bg-slate-800 cursor-pointer my-2 self-center" src={imageUrl || authUser.profilePicture} alt="Profile Image" />
            <button onClick={handleUpload} className="px-4 py-2 rounded-lg bg-indigo-600 items-center text-white" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Image'}
            </button>
        </div>
    </>
  )
}

export default ProfilePicture