import * as React from 'react'

export const Button = React.forwardRef(({ className, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-white   bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-600 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
