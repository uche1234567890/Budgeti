/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { FaTrash, FaPen} from 'react-icons/fa'
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from "../utils/dateSanitizer";
import { formatNumberWithNaira } from "../utils/numberFormatter";
import { useNavigate } from "react-router-dom";
import TransactionModal from "./TransactionModal";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { formatDateValue } from "../utils/dateFomat";

//const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';

const Transaction = () => {
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [transactionId, setTransactionId] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [initialValues, setInitialValues] = useState();
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const [filterType, setFilterType] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const handleFilterTypeChange = (event) => {
      setFilterType(event.target.value);
    };

    const handleDateChange = async(date) => {
      setSelectedDate(date);
      await axios.get(`${devApiUrl}/api/transaction/by-day/${formatDateValue(date, 'day')}`).then(response => {
        setTransactions(response.data.transactions)
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    };

    const handleMonthChange = async (date) => {
      setSelectedMonth(date);
      await axios.get(`${devApiUrl}/api/transaction/by-month/${formatDateValue(date, 'month')}`).then(response => {
        setTransactions(response.data.transactions)
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    };

    useEffect(() => {

        const fetchTransactions = async () => {
          await axios.get(`${devApiUrl}/api/transaction/list-all`).then(response => {
            setTransactions(response.data.transactions)
          }).catch(err => {
            toast.error(err.response.data.message)
          })
        }

        fetchTransactions()
    }, [])

    const updateTransaction = (targetId, updatedValues) => {
      setTransactions(prevTransactions => {
        const transactionExists = prevTransactions.some(category => category._id === targetId);
  
        if (transactionExists) {
          return prevTransactions.map(transaction =>
            transaction._id === targetId
              ? { ...transaction, ...updatedValues}
              : transaction
          );
        } else {
          const newTransaction = {
            _id: targetId,
            ...updatedValues
          };
          return [...prevTransactions, newTransaction];
        }
      });
    };

    const deleteTransaction = (targetId) => {
      setTransactions(prevTransactions => {
        return prevTransactions.filter(transaction => transaction._id !== targetId)
      })
    }

    const handleCreate = () => {
      setInitialValues({});
      setIsEdit(false);
      setShowTransactionModal(true);
  };

  const handleEdit = (transaction) => {
      console.log(transaction)
      setTransactionId(transaction._id)
      setInitialValues(transaction);
      setIsEdit(true);
      setShowTransactionModal(true);
  };

    const handleDelete = async (transactionId) => {
      await axios.delete(`${devApiUrl}/api/transaction/delete/${transactionId}`).then(response => {
        deleteTransaction(transactionId)
        toast.success("Deleted Successfully")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    }

    const submitForm = async (data) => {
      if(isEdit){
        const {type, amount, description, category} = data
        await axios.patch(`${devApiUrl}/api/transaction/update/${transactionId}`, {type, amount, description, category}).then(response => {
          updateTransaction(response.data.transaction._id, response.data.transaction)
          toast.success("Transaction Updated Successful")
          setShowTransactionModal(false);
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }else{
        const {type, amount, description, category} = data
        await axios.post(`${devApiUrl}/api/transaction/create`, {type, amount, description, category}).then(response => {
          updateTransaction(response.data.transaction._id, response.data.transaction)
          toast.success("Transaction Creation Successful")
          setShowTransactionModal(false);
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }
      
    }

  return (
    <div>
        <div className="flex flex-row justify-end mb-2 mx-2">
            <div className="flex flex-row mx-2 items-center space-x-0 md:space-x-2">
              <div className="mb-4">
                <select value={filterType} onChange={handleFilterTypeChange} className="border border-gray-300 px-3 py-1 rounded-xl w-full md:w-56 h-12">
                  <option value="">Select Time Period</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                </select>
              </div>

              {filterType === 'day' && (
                <div className="mb-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                    className="border border-gray-300 px-3 py-1 rounded-xl w-full md:w-56 h-12"
                  />
                </div>
              ) }
              { filterType === 'month' && (
                <div className="mb-4">
                  <DatePicker
                    selected={selectedMonth}
                    onChange={handleMonthChange}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                    className="border border-gray-300 px-3 py-1 rounded-xl w-full md:w-56 h-12"
                  />
                </div>
              ) }
            </div>
            <button className="px-3 py-1 rounded-xl bg-indigo-600 text-white w-full md:w-56 h-12" onClick={handleCreate}>Create Transaction</button>
        </div>

        <div className="transaction-section h-40 py-12 mb-16 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-slate-50 mb-2">Transaction</h2>
          <p className="text-green-600">Keep track of all of your income and expenses for a better spending habit</p>
        </div>
        

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white">
        <thead className="text-xs text-gray-700 uppercase border-b-2 border-slate-700 bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Type
                </th>
                <th scope="col" className="px-6 py-3">
                    Amount
                </th>
                <th scope="col" className="px-6 py-3">
                    description
                </th>
                <th scope="col" className="px-6 py-3">
                    Created
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction, index) => (
            <tr key={index} className="bg-white dark:border-gray-700">
                <th scope="row" className={`px-6 py-4 font-medium whitespace-nowrap ${transaction.type == 'income' ? 'text-green-500' : transaction.type == 'expense' ? 'text-red-500': 'text-blue-500'}`}>
                    {capitalizeFirstLetter(transaction.type)}
                </th>
                <td className="px-6 py-4">
                    {formatNumberWithNaira(transaction.amount)}
                </td>
                <td className="px-6 py-4">
                    {transaction.description}
                </td>
                <td className="px-6 py-4">
                    {formatDate(transaction.createdAt)}
                </td>
                <td className="flex gap-2 px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer hover:underline" onClick={() => handleEdit(transaction)}><FaPen /></a>
                    <a href="#" className="font-medium text-red-600 dark:text-red-500 cursor-pointer hover:underline" onClick={() => handleDelete(transaction._id)}><FaTrash /></a>
                    {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(transaction._id)}><FaEye /></a> */}
                </td>
            </tr>
          ))
          }
          {transactions.length < 1 && (
          <div className="text-gray-700 items-center font-normal text-lg py-32">
              No transaction avaialble at this point
            </div>
          )}
        </tbody>
    </table>
</div>


        {showTransactionModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {isEdit ? "Edit Transaction" : "Create Transaction"}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowTransactionModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <TransactionModal initialValues={initialValues} onSubmit={submitForm} title={isEdit ? "Edit": "Create"}/>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                  >
                    Close
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

    </div>
  )
}

export default Transaction