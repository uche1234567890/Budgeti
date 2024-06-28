import SideBar from "../components/SideBar"
import Category from "../components/Category"
import Transaction from "../components/Transaction"
import Expense from "../components/Expense"
import { useState } from "react"

const Dashboard = () => {
  const [activeState, setActiveState] = useState("Expense")

  return (
    <div className="flex">
      <SideBar state={activeState} setState={setActiveState}/>
      <div className="flex-grow p-6 bg-gray-100">
          {activeState == "Category" && <Category />}
          {activeState == "Transaction" && <Transaction />}
          {activeState == "Expense" && <Expense />}
          {/* {activeState == "Setting" && <Expense />} */}
      </div>
    </div>
  )
}

export default Dashboard