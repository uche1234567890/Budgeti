/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const NumberInput = ({ name, label, register, setValue, required, errors, defaultValue }) => {
  const [value, setInputValue] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setInputValue(formatNumber(defaultValue.toString()));
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  const formatNumber = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    console.log(e.target.value)
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue)) {
      setInputValue(formatNumber(rawValue));
      setValue(name, rawValue);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        placeholder={label}
        className="border p-3 rounded-lg w-full"
        onChange={handleChange}
        onBlur={(e) => register(name, { required }).onBlur(e)}
        {...register(name, { required })}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm pb-2 font-bold">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default NumberInput