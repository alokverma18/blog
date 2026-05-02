import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-primary-600 hover:bg-primary-700',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button 
      type={type}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button