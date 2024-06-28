import { useState, useEffect } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { formatNumberWithNaira } from "../utils/numberFormatter";
import IncomeExpenseModule from "./IncomeExpenseModule";

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

    useEffect(() => {
      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
    }, [])

    const calculateIncome = async(type, currentMonth, currentYear) => {
      const monthValue = currentMonth + 1
      if(type === 'month'){
        await axios.get(`${devApiUrl}/api/aggregation/sum-monthly-expenses-by-category/${monthValue + '-' + currentYear}`).then(response => {
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
  
    const handleTypeChange = (event) => {
      setType(event.target.value);
      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
    };
  
    const increment = () => {
      if (type === 'month') {
        setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
        if (currentMonth === 11) {
          setCurrentYear((prevYear) => prevYear + 1);
        }
      } else {
        setCurrentYear((prevYear) => prevYear + 1);
      }

      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
    };
  
    const decrement = () => {
      if (type === 'month') {
        setCurrentMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
        if (currentMonth === 0) {
          setCurrentYear((prevYear) => prevYear - 1);
        }
      } else {
        setCurrentYear((prevYear) => prevYear - 1);
      }

      calculateIncome(type, currentMonth, currentYear)
      calculateExpense(type, currentMonth, currentYear)
    };

     // Dummy data for budget information
     const initialBudgetData = {
      income: [
          { name: 'Salary', amount: 5000 },
          { name: 'Freelance', amount: 1500 },
      ],
      expenses: [
          { name: 'Rent', amount: 1000 },
          { name: 'Groceries', amount: 300 },
          { name: 'Utilities', amount: 200 },
          { name: 'Transport', amount: 150 },
      ],
  };


  return (
    <div>
      <h2>Budget</h2>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <select value={type} onChange={handleTypeChange} className="border p-2 rounded-lg">
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="flex items-center">
          <button onClick={decrement} className="bg-gray-300 p-2 rounded-l-lg">-</button>
          <div className="bg-white p-2 border-t border-b border-gray-300">
            {type === 'month' ? months[currentMonth] : currentYear}
          </div>
          <button onClick={increment} className="bg-gray-300 p-2 rounded-r-lg">+</button>
        </div>
      </div>

      <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Budget Module</h1>
            <div className="flex flex-wrap mx-4">
              <h3>Income - {formatNumberWithNaira(incomeAmount)}</h3>
              <h3>Expenses - {formatNumberWithNaira(expenseAmount)}</h3>
            </div>
            <div className="flex flex-wrap -mx-4">
                <IncomeExpenseModule title="Income" items={initialBudgetData.income} />
                <IncomeExpenseModule title="Expenses" items={initialBudgetData.expenses} />
            </div>
        </div>
      
    </div>
  )
}

export default Expense