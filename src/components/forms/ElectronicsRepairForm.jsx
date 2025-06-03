'use client'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const ElectronicsRepairForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [serverErrors, setServerErrors] = useState({})

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/electronics-repairs', data)
      alert('Electronics repair request submitted successfully.')
      setServerErrors({})
      reset()
    } catch (error) {
      if (error.response?.status === 422) {
        setServerErrors(error.response.data.errors)
      } else {
        alert('An error occurred while submitting the form.')
      }
    }
  }

  return (
    <Card className="shadow-lg bg-black/70">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="col-span-1">
            <Input {...register('deviceType', { required: true })} placeholder="Device Type (e.g. Laptop, TV)" />
            {errors.deviceType && <span className="text-red-500 text-sm">Device Type is required</span>}
            {serverErrors.deviceType && <span className="text-red-500 text-sm">{serverErrors.deviceType[0]}</span>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <Textarea {...register('problemDescription', { required: true })} placeholder="Describe the Issue" />
            {errors.problemDescription && <span className="text-red-500 text-sm">Problem description is required</span>}
            {serverErrors.problemDescription && <span className="text-red-500 text-sm">{serverErrors.problemDescription[0]}</span>}
          </div>

          <div className="col-span-1">
            <Input {...register('repairCostEstimate')} placeholder="Estimated Repair Cost (optional)" />
            {serverErrors.repairCostEstimate && <span className="text-red-500 text-sm">{serverErrors.repairCostEstimate[0]}</span>}
          </div>

          <div className="col-span-1">
            <Input {...register('location', { required: true })} placeholder="Location" />
            {errors.location && <span className="text-red-500 text-sm">Location is required</span>}
            {serverErrors.location && <span className="text-red-500 text-sm">{serverErrors.location[0]}</span>}
          </div>

          <div className="col-span-1">
            <Input {...register('phoneNumber', { required: true })} placeholder="Phone Number" />
            {errors.phoneNumber && <span className="text-red-500 text-sm">Phone Number is required</span>}
            {serverErrors.phoneNumber && <span className="text-red-500 text-sm">{serverErrors.phoneNumber[0]}</span>}
          </div>

          <div className="col-span-1">
            <Input {...register('email')} placeholder="Email Address (optional)" />
            {serverErrors.email && <span className="text-red-500 text-sm">{serverErrors.email[0]}</span>}
          </div>

          <div className="col-span-1">
            <Input {...register('warranty')} placeholder="Warranty Offer (optional)" />
            {serverErrors.warranty && <span className="text-red-500 text-sm">{serverErrors.warranty[0]}</span>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <Textarea {...register('notes')} placeholder="Additional Notes (optional)" />
            {serverErrors.notes && <span className="text-red-500 text-sm">{serverErrors.notes[0]}</span>}
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <Button type="submit">Submit</Button>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}

export default ElectronicsRepairForm
