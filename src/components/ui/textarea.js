import * as React from 'react'

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full border border-gray-300 rounded-xl px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black/85 text-sm bg-blue-100 resize-none ${className}`}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'
