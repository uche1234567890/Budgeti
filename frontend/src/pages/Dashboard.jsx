import SideBar from "../components/SideBar"
import Category from "../components/Category"
import Transaction from "../components/Transaction"
import Expense from "../components/Expense"
import { useState } from "react"

const Dashboard = () => {
  const [activeState, setActiveState] = useState("Category")

  return (
    <div className="flex">
      <SideBar setState={setActiveState}/>
      <div className="flex-grow p-6 bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
        <p className="text-lg">Here is your dashboard content.</p>
          {activeState == "Category" && <Category />}
          {activeState == "Transaction" && <Transaction />}
          {activeState == "Expense" && <Expense />}
      </div>
    </div>
  )
}

export default Dashboard