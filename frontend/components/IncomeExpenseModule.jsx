/* eslint-disable react/prop-types */
import { formatNumberWithNaira } from "../utils/numberFormatter";

const IncomeExpenseModule = ({ title, items }) => {
    const calculateTotal = (items) => items.reduce((acc, item) => acc + item.amount, 0);
  return (
    <div className="w-full md:w-1/2 px-4 mb-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-2 font-semibold">Total: {formatNumberWithNaira(calculateTotal(items))}</p>
        {items.map((item, index) => (
            <div key={index} className="mb-2">
                <p className="font-medium">{item.name}</p>
                <p>Amount: {formatNumberWithNaira(item.amount)}</p>
            </div>
        ))}
    </div>
  )
}

export default IncomeExpenseModule