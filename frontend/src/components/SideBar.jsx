

// eslint-disable-next-line react/prop-types
const SideBar = ({ setState }) => {
  
  return (
    <div className="h-screen bg-slate-200 text-black w-64 p-4">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <ul>
        <li className="mb-4">
          <button onClick={() => setState('Category')} className="hover:text-gray-400">Category</button>
        </li>
        <li className="mb-4">
          <button onClick={() => setState('Transaction')} className="hover:text-gray-400">Transaction</button>
        </li>
        <li className="mb-4">
          <button onClick={() => setState('Expense')} className="hover:text-gray-400">Expense</button>
        </li>
        <li className="mb-4"><a href="#logout" className="hover:text-gray-400">Logout</a></li>
      </ul>
    </div>
  )
}

export default SideBar