'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import SidebarLayout from '@/components/Layouts/SidebarLayout'
import Loading from '../../Loading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    contact: '',
    address: '',
    bio: '',
    gender: '',
    birthday: '',
  })

  useEffect(() => {
    document.title = 'update-Profile'
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const userRes = await axios.get('/api/user')
        const profileRes = await axios.get('/api/profile')

        setFormData(prev => ({
          ...prev,
          name: userRes.data.name || '',
          email: userRes.data.email || '',
          location: profileRes.data?.location || '',
          phone: profileRes.data?.phone || '',
          contact: profileRes.data?.contact || '',
          address: profileRes.data?.address || '',
          bio: profileRes.data?.bio || '',
          gender: profileRes.data?.gender || '',
          birthday: profileRes.data?.birthday || '',
        }))

        if (profileRes.data?.image) {
          setImagePreview(`/storage/${profileRes.data.image}`)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load user/profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = new FormData()
      payload.append('location', formData.location)
      payload.append('phone', formData.phone)
      payload.append('contact', formData.contact)
      payload.append('address', formData.address)
      payload.append('bio', formData.bio)
      payload.append('gender', formData.gender)
      payload.append('birthday', formData.birthday)
      if (imageFile) {
        payload.append('image', imageFile)
      }

      await axios.post('/api/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Profile updated successfully.')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarLayout>
      <div className="py-16">
        {/* <h1 className="text-2xl font-bold mb-6 text-black/75">Profile</h1> */}

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <Card className="max-w-3xl mx-auto bg-black/70 p-6">
          {loading ? (
            <Loading />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Name</label>
                  <Input type="text" name="name" value={formData.name} disabled />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Email</label>
                  <Input type="email" name="email" value={formData.email} disabled />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-200">Profile Image</label>

                  <div className="flex items-center gap-3 mb-4">
                    <label
                      htmlFor="media-upload"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] cursor-pointer"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span>Choose Files</span>
                    </label>
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full mb-2 object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Location</label>
                  <Input type="text" name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Phone</label>
                  <Input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Contact</label>
                  <Input type="text" name="contact" value={formData.contact} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Address</label>
                  <Input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Gender</label>
                  <Input type="text" name="gender" value={formData.gender} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-100">Birthday</label>
                  <Input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-100">Bio</label>
                <Textarea name="bio" value={formData.bio} onChange={handleChange} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="px-10">
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </SidebarLayout>
  )
}

export default Page
