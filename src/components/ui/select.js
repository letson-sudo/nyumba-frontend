'use client'

import { useState, useEffect, createContext, useContext } from 'react'

// Create a context to share state
const SelectContext = createContext()

export const Select = ({ children, value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value || '')

  useEffect(() => {
    if (onChange) {
      onChange(selected)
    }
  }, [selected, onChange])

  return (
    <SelectContext.Provider value={{ open, setOpen, selected, setSelected }}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({ children }) => {
  const { open, setOpen } = useContext(SelectContext)

  return (
    <div
      className="flex items-center justify-between w-full px-3 py-2 bg-blue-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      onClick={() => setOpen(!open)}
    >
      {children}
      <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

export const SelectValue = ({ placeholder }) => {
  const { selected } = useContext(SelectContext)

  return (
    <span className={`text-sm ${selected ? 'text-gray-800' : 'text-gray-500'}`}>
      {selected || placeholder}
    </span>
  )
}

export const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext)

  if (!open) return null

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div className="max-h-60 overflow-y-auto">{children}</div>
    </div>
  )
}

export const SelectItem = ({ children, value }) => {
  const { setSelected, setOpen } = useContext(SelectContext)

  const handleSelect = () => {
    setSelected(value)
    setOpen(false)
  }

  return (
    <div
      className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-gray-700"
      onClick={handleSelect}
    >
      {children}
    </div>
  )
}
