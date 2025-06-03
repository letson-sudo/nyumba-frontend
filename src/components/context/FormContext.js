"use client"
// src/components/context/FormContext.js
import { createContext, useContext, useState } from 'react'

const FormDataContext = createContext()

export const useFormData = () => {
  const context = useContext(FormDataContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context
}

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({})

  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }))
  }

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  )
}
