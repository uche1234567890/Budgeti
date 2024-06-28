/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
//import NumberInput from "./NumberInput";

const ModalComponent = ({ initialValues, onSubmit, title }) => {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        defaultValues: initialValues
    });
    const [selectedEmoji, setSelectedEmoji] = useState();

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
            setSelectedEmoji(initialValues.icon || ''); // Ensure emoji state is updated
        }
    }, [initialValues, reset]);


    const handleEmojiChange = (value) => {
        setSelectedEmoji(value);
        setValue('icon', value, { shouldValidate: true });
    };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <input type="text" name="name" id="name" placeholder="Name" className="border p-3 rounded-lg w-full"
                    {...register("name", { required: "Please input a name" })} />
                {errors.name && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.name.message}</p>)}
            </div>

            <div className="mb-4">
                <InputEmoji name="icon" id="icon" cleanOnEnter placeholder="Select an emoji" value={selectedEmoji} borderRadius={9} className="border p-3 rounded-lg w-full"
                    onChange={handleEmojiChange} />
                {errors.icon && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.icon.message}</p>)}
            </div>

            <div className="mb-4">
                <input type="number" name="budgetAmount" id="budgetAmount" placeholder="Budget Amount" className="border p-3 rounded-lg w-full"
                    {...register("budgetAmount", { required: "Please input a budget" })} />
                {errors.budgetAmount && (<p className="text-red-500 text-sm pb-2 font-bold">{errors.budgetAmount.message}</p>)}
            </div>
            {/* <div className="mb-4">
            <NumberInput name="budgetAmount" label="Budget Amount" register={register} setValue={setValue} required="Please input a budget" errors={errors} defaultValue={initialValues?.budgetAmount || ""}/>
            </div> */}

            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" type="submit">
                {title == "Create" ? "Create Category" : "Edit Category"}
            </button>
        </form>
  )
}

export default ModalComponent