import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    onChangeHandler = () => {},
    ...props
  },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-600 duration-200 border border-gray-300 dark:border-gray-600 w-full ${className}`}
        ref={ref}
        {...props}
        id={id}
        onChange={onChangeHandler}
      />
    </div>
  );
});

export default Input;
