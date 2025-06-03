import * as React from 'react'

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full border border-gray-300 rounded-xl px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-100 placeholder-gray-600 text-sm ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input'
