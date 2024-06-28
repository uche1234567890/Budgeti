/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPen } from "react-icons/fa";
import { formatNumberWithNaira } from "../utils/numberFormatter";
import { formatDate } from "../utils/dateSanitizer";
import axios from "axios";
import ModalComponent from "./ModalComponent";

// const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';

const Category = () => {
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([])
    const [initialValues, setInitialValues] = useState({ name: "", icon: "", budgetAmount: "" });
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate()

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        const fetchCategories = async () => {
          await axios.get(`${devApiUrl}/api/category/get-all`).then(response => {
            setCategories(response.data)
          }).catch(err => {
            toast.error(err.response.data.message)
          })
        }

        fetchCategories()
    }, [])

    const submitForm = async (data) => {
      if(isEdit){
        console.log(data)
        const {name, icon, budgetAmount} = data
        await axios.post(`${devApiUrl}/api/category/update`, {name, icon, budgetAmount}).then(response => {
          toast.success("Category Creation Successful")
          navigate("/dashboard")
          setShowModal(false)
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      }
      const {name, icon, budgetAmount} = data
      await axios.post(`${devApiUrl}/api/category/create`, {name, icon, budgetAmount}).then(response => {
        toast.success("Category Creation Successful")
        navigate("/dashboard")
        setShowModal(false)
      }).catch(err => {
        toast.error(err.response.data.message)
      })
    }

    const handleCreate = () => {
      setInitialValues({ name: "", icon: "", budgetAmount: "" });
      setIsEdit(false);
      setShowModal(true);
  };

  const handleEdit = (category) => {
      setInitialValues(category);
      setIsEdit(true);
      setShowModal(true);
  };

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
        <div className="flex justify-end mb-2 mx-2">
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={handleCreate}>Create Category</button>
        </div>
        

<div className="relative overflow-x-auto bg-inherit shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white">
        <thead className="text-xs text-gray-700 uppercase border-b-2 border-slate-700 bg-gray-50">
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
            {categories?.map((category, index) => (
                <tr key={index} className="bg-white dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {category.name}
                    </th>
                    <td className="px-6 py-4">
                        {category.icon}
                    </td>
                    <td className="px-6 py-4">
                        {formatNumberWithNaira(category.budgetAmount)}
                    </td>
                    <td className="px-6 py-4">
                        {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 flex flex-col md:flex-row space-x-2">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleEdit(category)}><FaPen /></a>
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
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                  {isEdit ? "Edit Category": "Create Category"}
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
                <ModalComponent initialValues={initialValues} onSubmit={submitForm} title={isEdit ? "Edit": "Create"}/>
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