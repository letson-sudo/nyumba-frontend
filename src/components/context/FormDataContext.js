'use client'
import { createContext, useContext, useState } from 'react'

const FormDataContext = createContext()

export function FormDataProvider({ children }) {
  const [formData, setFormData] = useState({
    'computer sales': {},
    'networking service': {},
    'software development': {},
    'electronics repair': {},
  })

  const updateCategoryData = (category, data) => {
    setFormData(prev => ({ ...prev, [category]: data }))
  }

  return (
    <FormDataContext.Provider value={{ formData, updateCategoryData }}>
      {children}
    </FormDataContext.Provider>
  )
}

export function useFormData() {
  return useContext(FormDataContext)
}
