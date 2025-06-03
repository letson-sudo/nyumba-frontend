'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from '@/lib/axios'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon } from 'lucide-react'
import SidebarLayout from '@/components/Layouts/SidebarLayout'
import InputError from '@/components/InputError'
import Loading from '@/app/(app)/Loading'

const EditReviewComputerSale = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()

  const [form, setForm] = useState({
    productName: '',
    price: '',
    location: '',
    quantity: '',
    warranty: '',
    description: '',
  })

  const [mediaFiles, setMediaFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      const fetchSaleData = async () => {
        try {
          await axios.get('/sanctum/csrf-cookie')

          const response = await axios.get(`/api/computersales/${id}`)
          const data = response.data

          setForm({
            productName: data.product_name || '',
            price: data.price || '',
            location: data.location || '',
            quantity: data.quantity || '',
            warranty: data.warranty || '',
            description: data.description || '',
          })

          setMediaFiles(data.media_files || [])
        } catch (err) {
          console.error('Error fetching computer sale data:', err)
          setError('Failed to load sale data.')
        } finally {
          setLoading(false)
        }
      }

      fetchSaleData()
    }
  }, [id])

  if (loading) return <Loading />
  if (error) return <p className="text-red-500 text-center">{error}</p>

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })

    mediaFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('media_files[]', file)
      }
    })

    try {
      await axios.get('/sanctum/csrf-cookie')
      await axios.post(`/api/computersales/${id}?_method=PUT`, formData)
      alert('Computer sales item updated successfully')
      router.push('/reviewcomputersales')
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else {
        console.error('An error occurred during update:', error)
        alert('An error occurred while updating.')
      }
    }
  }

  return (

    <div className='mt-16'>
<SidebarLayout>

    <Card className="shadow-lg bg-black/75 max-w-3xl mx-auto ">
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-10">
          <div className="flex flex-col gap-2">
            <Input name="productName" value={form.productName} onChange={handleChange} placeholder="Product Name" />
            <InputError messages={errors.productName} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <Input name="price" value={form.price} onChange={handleChange} placeholder="Price (MWK)" />
            <InputError messages={errors.price} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
            <InputError messages={errors.location} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <Input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" />
            <InputError messages={errors.quantity} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2">
            <select
              name="warranty"
              value={form.warranty}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-blue-100 text-gray-800 border"
            >
              <option value="">Select Warranty</option>
              <option value="No Warranty">No Warranty</option>
              <option value="1 Week">1 Week</option>
              <option value="2 Weeks">2 Weeks</option>
              <option value="3 Weeks">3 Weeks</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
            </select>
            <InputError messages={errors.warranty} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="bg-blue-100 text-gray-700  "
            />
            <InputError messages={errors.description} className="text-red-500 text-sm" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-200">Upload Images</label>
            <div className="flex items-center gap-3 mb-4">
              <label
                htmlFor="media-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531]"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Choose Images</span>
              </label>
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setMediaFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
              />
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mediaFiles.map((file, index) => {
                  const fileURL = typeof file === 'string' ? file : URL.createObjectURL(file)

                  return (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-lg border border-gray-600 bg-gray-800 p-2"
                    >
                      <img src={fileURL} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition-opacity">
                        Preview
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex justify-center">
            <Button type="submit" className="px-10">Update</Button>
          </div>
        </form>
      </CardContent>
    </Card>

    </ SidebarLayout>
    </div>
  )
}

export default EditReviewComputerSale
