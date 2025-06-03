'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon, VideoIcon } from 'lucide-react'
import InputError from '@/components/InputError'

const ComputerSalesForm = () => {
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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })
    mediaFiles.forEach(file => {
      formData.append('media_files[]', file)
    })

    try {
      await axios.post('/api/computersales', formData)
      alert('Computer sales item submitted successfully')
      setForm({
        productName: '',
        price: '',
        location: '',
        quantity: '',
        warranty: '',
        description: '',
      })
      setMediaFiles([])
      setErrors({})
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else {
        alert('An error occurred.')
      }
    }
  }

  return (
    <Card className="shadow-lg bg-black/70">
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <Input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Product Name"
            />
            <InputError messages={errors.productName} className="text-red-500 text-sm" />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <Input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (MWK)"
            />
            <InputError messages={errors.price} className="text-red-500 text-sm" />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <InputError messages={errors.location} className="text-red-500 text-sm" />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <Input
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
              placeholder="Quantity"
            />
            <InputError messages={errors.quantity} className="text-red-500 text-sm" />
          </div>

          {/* Warranty */}
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

          {/* Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="bg-blue-100 text-gray-700"
            />
            <InputError messages={errors.description} className="text-red-500 text-sm" />
          </div>

          {/* Upload Images or Videos */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-200">Upload Images or Videos</label>
            <div className="flex items-center gap-3 mb-4">
              <label
                htmlFor="media-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531]"
              >
                <ImageIcon className="w-5 h-5" />
                <VideoIcon className="w-5 h-5" />
                <span>Choose Files</span>
              </label>
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={e => setMediaFiles(Array.from(e.target.files || []))}
              />
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mediaFiles.map((file, index) => {
                  const fileType = file.type.split('/')[0]
                  const fileURL = URL.createObjectURL(file)

                  return (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-lg border border-gray-600 bg-gray-800 p-2"
                    >
                      {fileType === 'image' ? (
                        <img src={fileURL} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                      ) : (
                        <video src={fileURL} className="w-full h-32 object-cover rounded-md" muted />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition-opacity">
                        Preview
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <Button type="submit" className="px-10">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ComputerSalesForm
