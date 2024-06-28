import { useState, useEffect } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { formatNumberWithNaira } from "../utils/numberFormatter";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { formatDate } from "../utils/dateSanitizer";
import TotalBalance from '../assets/svg/Balance.svg'
import TotalIncome from '../assets/svg/Income.svg'
import TotalExpenses from '../assets/svg/Expenses.svg'

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';


const Expense = () => {
    const [type, setType] = useState('month');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [incomeAmount, setIncomeAmount] = useState(0)
    const [expenseAmount, setExpenseAmount] = useState(0)
    const [budgetAmount, setBudgetAmount] = useState(0)
    const [foreCastAmount, setForeCastAmount] = useState(0)

    const [activeTab, setActiveTab] = useState('expenses');
    const [incomeData, setIncomeData] = useState([])
    const [budgetData, setBudgetData] = useState([])

    useEffect(() => {
      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
      getCategoryExpenses(type, currentMonth, currentYear)
      getCategoryIncome(type, currentMonth, currentYear)
      getForecastedExpense()
    }, [])

    const calculateIncome = async(type, currentMonth, currentYear) => {
      const monthValue = currentMonth + 1
      if(type === 'month'){
        await axios.get(`${devApiUrl}/api/aggregation/sum-monthly-income/${monthValue + '-' + currentYear}`).then(response => {
          setIncomeAmount(response.data.totalIncome)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }else{
        await axios.get(`${devApiUrl}/api/aggregation/sum-yearly-income/${currentYear}`).then(response => {
          setIncomeAmount(response.data.totalIncome)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      } 
    }

    const calculateExpense = async(type, currentMonth, currentYear) => {
      console.log(type, currentMonth, currentYear)
      const monthValue = currentMonth + 1
      if(type === 'month'){
        await axios.get(`${devApiUrl}/api/aggregation/sum-monthly-expenses/${monthValue + '-' + currentYear}`).then(response => {
          setExpenseAmount(response.data.totalExpenses)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }else{
        await axios.get(`${devApiUrl}/api/aggregation/sum-yearly-expenses/${currentYear}`).then(response => {
          setExpenseAmount(response.data.totalExpenses)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      } 
    }

    const getCategoryExpenses = async(type, currentMonth, currentYear) =>{
      const monthValue = currentMonth + 1
      if(type === 'month'){
        await axios.get(`${devApiUrl}/api/aggregation/sum-monthly-expenses-by-category/${monthValue + '-' + currentYear}`).then(response => {
          console.log(response)
          const budgetAmount = response.data.reduce((accumulator, category) => accumulator + category.budgetAmount,
            0,
          )
          setBudgetAmount(budgetAmount)
          setBudgetData(response.data)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }else{
        await axios.get(`${devApiUrl}/api/aggregation/sum-yearly-expenses-by-category/${currentYear}`).then(response => {
          console.log(response)
          //setIncomeAmount(response.data.totalIncome)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      } 
    }

    const getCategoryIncome = async(type, currentMonth, currentYear) => {
      let monthValue = currentMonth + 1
      if(monthValue < 10) monthValue = "0" + monthValue
      if(type === 'month'){
        await axios.get(`${devApiUrl}/api/transaction/by-month/${monthValue + '-' + currentYear}`).then(response => {
          const incomeData = response.data.transactions.filter(item => item.type === "income");
          setIncomeData(incomeData)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }else{
        await axios.get(`${devApiUrl}/api/transaction/by-year/${currentYear}`).then(response => {
          console.log(response)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }
    }

    const getForecastedExpense = async() => {      
        await axios.get(`${devApiUrl}/api/aggregation/forecast-next-month-expense`).then(response => {
         console.log(response)
         setForeCastAmount(response.data.projectedExpense)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
    }
  
    const handleTypeChange = (event) => {
      setType(event.target.value);
      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
      getCategoryExpenses(type, currentMonth, currentYear)
      getCategoryIncome(type, currentMonth, currentYear)
    };
  
    const increment = () => {
      if (type === 'month') {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    } else {
        setCurrentYear(currentYear + 1);
    }

      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
      getCategoryExpenses(type, currentMonth, currentYear)
      getCategoryIncome(type, currentMonth, currentYear)
    };
  
    const decrement = () => {
      if (type === 'month') {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    } else {
        setCurrentYear(currentYear - 1);
    }

      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
      getCategoryExpenses(type, currentMonth, currentYear)
      getCategoryIncome(type, currentMonth, currentYear)
    };


  const handleTabSwitch = (tab) => setActiveTab(tab);
  const getProgressColor = (totalAmount, budgetAmount) => {
    if (totalAmount <= budgetAmount * 0.75) {
        return 'bg-green-500';
    } else if (totalAmount <= budgetAmount) {
        return 'bg-yellow-500';
    } else {
        return 'bg-red-500';
    }
};

const getProgressTextColor = (totalAmount, budgetAmount) => {
  if (totalAmount <= budgetAmount * 0.75) {
      return 'text-green-500';
  } else if (totalAmount <= budgetAmount) {
      return 'text-yellow-500';
  } else {
      return 'text-red-500';
  }
};

const getIncomeTextColor = (incomeAmount, expenseAmount) => {
  if (expenseAmount <= incomeAmount * 0.75) {
      return 'text-green-500';
  } else if (expenseAmount <= incomeAmount) {
      return 'text-yellow-500';
  } else {
      return 'text-red-500';
  }
};


  return (
    <div>
      <h2 className="ml-6 font-bold text-2xl text-[#181819] mb-4">Budget</h2>
      <div className="flex flex-col md:flex-row justify-end spaace-x-0 md:space-x-2 items-center">
            <div className="mb-4 mt-2">
                <select value={type} onChange={handleTypeChange} className="border p-2 rounded-lg w-full md:w-48 h-12">
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <div className="flex">
                <button onClick={decrement} className="p-2 h-12 w-12 flex items-center justify-center"><FaChevronLeft /></button>
                <div className="p-2 h-12 flex items-center justify-center w-full md:w-24">
                    {type === 'month' ? months[currentMonth] + ", " + currentYear : currentYear}
                </div>
                <button onClick={increment} className="p-2 rounded-r-lg h-12 w-12 flex items-center justify-center"><FaChevronRight /></button>
            </div>
      </div>

      <div className="flex flex-col md:flex-row space-x-12 ml-6">

        <div className="flex flex-col space-y-2 bg-white shadow-md rounded-lg w-1/3 h-32 p-4">
          <div className="flex flex-row justify-between space-x-4">
            <div>
              <h2 className="text-xl font-bold text-[#2E2A47]">Budget</h2>
              <p className="text-[#7E8CA0] text-xs font-medium mb-4">{type === 'month' ? months[currentMonth] + ", " + currentYear : currentYear}</p>
            </div>
            <div>
              <span className="w-12 h-12 rounded-xl bg-[#EDF4FF]"><img src={TotalBalance} className="w-6 h-6"/></span>
            </div>
          </div>
          <div className="my-4">
            <p className={`text-blue-500 text-2xl font-bold`}>{formatNumberWithNaira(budgetAmount)}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-2 bg-white shadow-md rounded-lg w-1/3 h-32 p-4">
          <div className="flex flex-row justify-between space-x-4">
            <div>
              <h2 className="text-xl font-bold text-[#2E2A47]">Expenses</h2>
              <p className="text-[#7E8CA0] text-xs font-medium mb-4">{type === 'month' ? months[currentMonth] + ", " + currentYear : currentYear}</p>
            </div>
            <div>
              <span className="w-12 h-12 rounded-xl bg-[#FFEDED]"><img src={TotalExpenses}/></span>
            </div>
          </div>
          <div className="my-4 flex flex-row justify-between space-x-4">
            <div>
              <p className="text-red-500 text-2xl font-bold">{formatNumberWithNaira(expenseAmount)}</p>
            </div>
            <div>
              <h3 className="text-[#7E8CA0] text-xs font-medium">Forecast Expense</h3>
              <h5 className="text-[#24233F] text-lg font-semibold">{formatNumberWithNaira(foreCastAmount)}</h5>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 bg-white shadow-md rounded-lg w-1/3 h-32 p-4">
          <div className="flex flex-row justify-between space-x-4">
            <div>
              <h2 className="text-xl font-bold text-[#2E2A47]">Funds Remaining</h2>
              <p className="text-[#7E8CA0] text-xs font-medium mb-4">{type === 'month' ? months[currentMonth] + ", " + currentYear : currentYear}</p>
            </div>
            <div>
              <span className="w-12 h-12 rounded-xl bg-[#00DF09]"><img src={TotalIncome} className="w-6 h-6"/></span>
            </div>
          </div>
          <div className="my-4">
            <p className={`${getIncomeTextColor(budgetAmount, expenseAmount)} text-2xl font-bold`}>{formatNumberWithNaira(budgetAmount - expenseAmount)}</p>
          </div>
        </div>

      </div>


        <div className="container mx-auto p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Budget Module</h1>
            <p className="text-gray-600">Manage your finances efficiently</p>
          </div>
          <div className="flex justify-start mb-4 px-2 py-2 bg-[#E1E1EB] w-1/4 rounded-3xl">
            <button
              className={`px-2 py-2 mx-1 rounded-3xl ${activeTab === 'income' ? 'bg-white text-blue-500' : 'text-[#2E2A47]'}`}
              onClick={() => handleTabSwitch('income')}
            >
              Income - {formatNumberWithNaira(incomeAmount)}
            </button>
            <button
              className={`px-4 py-2 mx-1 rounded-3xl ${activeTab === 'expenses' ? 'bg-white text-blue-500': 'text-[#2E2A47]'}`}
              onClick={() => handleTabSwitch('expenses')}
            >
              Expenses - {formatNumberWithNaira(expenseAmount)}
            </button>
          </div>
          <div>
            {activeTab === 'income' ? (
              <div>
                <h2 className="text-xl font-semibold mb-2 ml-4">Income List</h2>
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {incomeData.map((income) => (
                            <div key={income._id} className="flex flex-row bg-slate-100 shadow-md rounded-lg p-4">
                              <div>
                                <h2 className="text-lg font-semibold mb-2">{income.description}</h2>
                                <p className="text-gray-700">Created At <strong>{formatDate(income.createdAt)} </strong></p>
                                <p className="text-gray-700"><strong>Amount:</strong> {formatNumberWithNaira(income.amount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-700 bg-green-200 px-2 py-1 rounded-full">{income.type.charAt(0).toUpperCase() + income.type.slice(1)}</p>
                              </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            ) : (
              <div className="container mx-auto p-4">
                  <h1 className="text-2xl font-bold mb-4">Budget Comparison</h1>
                  {budgetData.map((category) => (
                      <div key={category.categoryId} className="mb-6">
                          <div className="flex flex-row justify-between items-center mb-2">
                              <div className="flex">
                                <span className="text-2xl mr-2">{category.icon}</span>
                                <span className="text-xl font-semibold">{category.name}</span>
                              </div>
                              <div>
                                  <h2 className={`bg-slate-200 ${getProgressTextColor(category.totalAmount, category.budgetAmount)} px-2 py-2 rounded-full`}>{((category.totalAmount /category.budgetAmount) * 100).toFixed(1)}%</h2>
                              </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-6">
                              <div
                                  className={`h-6 rounded-full ${getProgressColor(category.totalAmount, category.budgetAmount)}`}
                                  style={{ width: `${Math.min((category.totalAmount / category.budgetAmount) * 100, 100)}%` }}
                              ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                              <span>Total: {formatNumberWithNaira(category.totalAmount)}</span>
                              <span>Budget: {formatNumberWithNaira(category.budgetAmount)}</span>
                          </div>
                      </div>
                  ))}
              </div>
            )}
          </div>
    </div>
      
    </div>
  )
}

export default Expense