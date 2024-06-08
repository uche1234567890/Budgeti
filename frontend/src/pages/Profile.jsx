import SideBar from "../components/SideBar"

const Profile = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-grow p-6 bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
        <p className="text-lg">Here is your dashboard content.</p>

      </div>
    </div>
  )
}

export default Profile