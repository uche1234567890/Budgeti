import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';

const Transaction = () => {
    const [showIncomeModal, setShowIncomeModal] = useState(false)
    const [showExpenseModal, setShowExpenseModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [transactions, setTransactions] = useState([])
    const {register, handleSubmit, watch, formState: {errors}} = useForm()
    const type = watch("type");
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        const fetchCategories = async () => {
          await axios.get(`${devApiUrl}/api/category/get-all`).then(response => {
            console.log(response)
            setCategories(response.data)
            //toast.success("Sign In Successful")
            //navigate("/profile")
          }).catch(err => {
            toast.error(err.response.data.message)
          })
        }

        const fetchTransactions = async () => {
          await axios.get(`${devApiUrl}/api/transaction/list-all`).then(response => {
            console.log(response)
            setTransactions(response.data.transactions)
            //toast.success("Sign In Successful")
            //navigate("/profile")
          }).catch(err => {
            toast.error(err.response.data.message)
          })
        }

        fetchCategories()
        fetchTransactions()
    }, [])

    const submitForm = async (data) => {
      console.log(data)
      const {type, amount, description, category} = data
      await axios.post(`${devApiUrl}/api/transaction/create`, {type, amount, description, category}).then(response => {
        console.log(response)
        toast.success("Category Creation Successful")
        //navigate("/profile")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    }

  return (
    <div>
        <h2>Transaction</h2>
        <div>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={() => setShowIncomeModal(true)}>Create Transaction</button>
        </div>
        

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    Updated
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <tr key={transaction.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {transaction.type}
                </th>
                <td className="px-6 py-4">
                    {transaction.amount}
                </td>
                <td className="px-6 py-4">
                    {transaction.description}
                </td>
                <td className="px-6 py-4">
                    {transaction.updatedAt}
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                </td>
            </tr>
          ))
          }
        </tbody>
    </table>
</div>


        {showIncomeModal ? (
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
                    Create Income
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowIncomeModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => submitForm(data))}>
                    <div className="mb-4">
                      <select name="type" id="type" className="border p-3 rounded-lg w-full" {...register("type", { required: "Please select a type" })}>
                        <option value="">Select Type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                      {errors.type && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.type.message}</p>)}
                    </div>

                    <div className="mb-4">
                      <input type="number" name="amount" id="amount" placeholder="Amount" className="border p-3 rounded-lg w-full" 
                      {...register("amount", {required: "Please input an amount" })}/>
                      {errors.amount && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.amount.message}</p>)}
                    </div>

                    {type == "expense" && <div className="mb-4">
                      <select name="category" id="category" className="border p-3 rounded-lg w-full" {...register("category", { required: "Please select a category" })}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.category.message}</p>)}
                    </div>}

                    <div className="mb-4">
                      <textarea name="description" id="description" placeholder="Description" className="border p-3 rounded-lg w-full"
                        {...register("description", { required: "Please input a description" })}
                      />
                      {errors.description && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.description.message}</p>)}
                    </div>

                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">Create Income</button>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowIncomeModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowIncomeModal(false)}
                  >
                    Save Changes
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