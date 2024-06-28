/* eslint-disable react/prop-types */
import { useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';

//const apiUrl = 'https://testenv-budgetapp-api.onrender.com';
const devApiUrl = 'http://localhost:8000';

const TransactionModal = ({ initialValues, onSubmit, title}) => {
    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm({
        defaultValues: initialValues
    })
    const type = watch("type");
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
          await axios.get(`${devApiUrl}/api/category/get-all`).then(response => {
            setCategories(response.data)
          }).catch(err => {
            console.log(err)
          })
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);
    
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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

                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">{title == "Create" ? "Create Transaction" : "Edit Transaction"}</button>
                  </form>
  )
}

export default TransactionModal