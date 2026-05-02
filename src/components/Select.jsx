import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='inline-block mb-1 pl-1 text-sm font-medium text-gray-700 dark:text-gray-200'>{label}</label>}
        <select {...props} 
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-600 duration-200 border border-gray-300 dark:border-gray-600 w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}

        </select>
    </div>
  )
}

export default React.forwardRef(Select)