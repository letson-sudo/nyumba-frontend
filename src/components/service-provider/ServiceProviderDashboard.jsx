'use client'

import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import SidebarLayout from '@/components/Layouts/SidebarLayout'
import ComputerSalesForm from '@/components/forms/ComputerSalesForm'
import NetworkingServiceForm from '@/components/forms/NetworkingServiceForm'
import SoftwareDevelopmentForm from '@/components/forms/SoftwareDevelopmentForm'
import ElectronicsRepairForm from '@/components/forms/ElectronicsRepairForm'
import ReviewButton from '../reviews/ReviewButton'

export default function ServiceProviderDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('')

  const renderForm = () => {
    switch (selectedCategory) {
      case 'computer sales':
        return <ComputerSalesForm />
      case 'networking service':
        return <NetworkingServiceForm />
      case 'software development':
        return <SoftwareDevelopmentForm />
      case 'electronics repair':
        return <ElectronicsRepairForm />
      default:
        return (
          <p className="text-gray-500 text-center">
            
          </p>
        )
    }
  }

  return (
    <SidebarLayout>
    <div className="max-w-4xl mx-auto  ">
      <div className='bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] p-6'>
      <h2 className="text-2xl font-bold text-center ">Select Your Service</h2>

      </div>

      <div className='bg-black/70 pb-10 grid grid-cols-2'>
      <div>
        <label htmlFor="service-select" className="block mb-2 font-medium text-gray-200 text-sm ml-8 pt-1">
          Service Category
        </label>

        <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
          <Select.Trigger
            id="service-select"
            className="w-1/2 ml-7 p-1 border rounded-xl flex justify-between items-center bg-blue-100 text-gray-700 text-sm"
          >
            <Select.Value placeholder="-- Select Service Category --" />
            <Select.Icon />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="bg-white border rounded shadow-md mt-1">
              <Select.ScrollUpButton className="text-center py-1">▲</Select.ScrollUpButton>
              <Select.Viewport>
                <Select.Item
                  value="computer sales"
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Select.ItemText>Computer Sales</Select.ItemText>
                </Select.Item>
                <Select.Item
                  value="networking service"
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Select.ItemText>Networking Service</Select.ItemText>
                </Select.Item>
                <Select.Item
                  value="software development"
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Select.ItemText>Software Development</Select.ItemText>
                </Select.Item>
                <Select.Item
                  value="electronics repair"
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Select.ItemText>Electronics Repair</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
              <Select.ScrollDownButton className="text-center py-1">▼</Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
</div>

<div className=' ml-64 mt-7'>
<ReviewButton />

</div>
      </div>

      <div className=''>{renderForm()}</div>
    </div>

    
    </SidebarLayout>
  )
}
