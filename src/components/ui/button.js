import * as React from 'react'

export const Button = React.forwardRef(({ className, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-black   bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
