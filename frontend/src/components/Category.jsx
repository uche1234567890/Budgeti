import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import InputEmoji from "react-input-emoji";

const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';

const Category = () => {
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState()
    const {register, handleSubmit, setValue, formState: {errors}} = useForm()
    const navigate = useNavigate()

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

        fetchCategories()
    }, [])

    const submitForm = async (data) => {
      console.log(data)
      const {name, icon, budgetAmount} = data
      await axios.post(`${devApiUrl}/api/category/create`, {name, icon, budgetAmount}).then(response => {
        console.log(response)
        toast.success("Category Creation Successful")
        navigate("/profile")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    }

    const handleDelete = async (categoryId) => {
      console.log(categoryId)
      await axios.delete(`${devApiUrl}/api/category/delete/${categoryId}`).then(response => {
        console.log(response)
        toast.success("Deleted Successfully")
        navigate("/profile")
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    }
  return (
    <div>
        <h2>Category</h2>
        <div>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={() => setShowModal(true)}>Create Category</button>
        </div>
        

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Icon
                </th>
                <th scope="col" className="px-6 py-3">
                    Amount
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
            {categories?.map((category) => (
                <tr key={category.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {category.name}
                    </th>
                    <td className="px-6 py-4">
                        {category.icon}
                    </td>
                    <td className="px-6 py-4">
                        {category.budgetAmount}
                    </td>
                    <td className="px-6 py-4">
                        {category.createdAt}
                    </td>
                    <td className="px-6 py-4 flex flex-col md:flex-row space-x-2">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        <a className="font-medium text-red-600 dark:text-red-500 cursor-pointer hover:underline" onClick={() => handleDelete(category._id)}><FaTrash /></a>
                    </td>
                </tr>
            ))
            }
        </tbody>
    </table>
</div>


        {showModal ? (
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
                    Modal Title
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
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
                            <input type="text" name="name" id="name" placeholder="Name" className="border p-3 rounded-lg w-full" 
                            {...register("name", {required: "Please input a name" })}/>
                            {errors.name && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.name.message}</p>)}
                        </div>

                        <div className="mb-4">
                            <InputEmoji name="icon" id="icon" cleanOnEnter  placeholder="Type a message" className="border p-3 rounded-lg w-full"
                            onChange={(value) => setValue('icon', value, { shouldValidate: true })}/>
                            {errors.icon && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.icon.message}</p>)}
                        </div>

                        <div className="mb-4">
                            <input type="number" name="budgetAmount" id="budgetAmount" placeholder="Budget Amount" className="border p-3 rounded-lg w-full" 
                            {...register("budgetAmount", {required: "Please input a budget" })}/>
                            {errors.budgetAmount && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.budgetAmount.message}</p>)}
                        </div>

                        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">Create Expense</button>
                    </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
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

export default Category