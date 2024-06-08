

const SideBar = () => {
    return (
      <div className="h-screen bg-slate-200 text-black w-64 p-4">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <ul>
          <li className="mb-4"><a href="#home" className="hover:text-gray-400">Home</a></li>
          <li className="mb-4"><a href="#profile" className="hover:text-gray-400">Profile</a></li>
          <li className="mb-4"><a href="#settings" className="hover:text-gray-400">Settings</a></li>
          <li className="mb-4"><a href="#logout" className="hover:text-gray-400">Logout</a></li>
        </ul>
      </div>
    )
  }
  
  export default SideBar