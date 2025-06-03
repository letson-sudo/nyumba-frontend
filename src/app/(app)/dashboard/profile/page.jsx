'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import SidebarLayout from '@/components/Layouts/SidebarLayout'
import Loading from '../../Loading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ProfilePage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    document.title = 'Profile'
  }, [])

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const [userRes, profileRes] = await Promise.all([
          axios.get('/api/user'),
          axios.get('/api/profile'),
        ])
        setUser(userRes.data)
        setProfile(profileRes.data)

        if (profileRes.data?.image) {
          setImagePreview(`/storage/${profileRes.data.image}`)
        }
      } catch (err) {
        console.error('Failed to fetch user/profile:', err)
        setError('Unable to load user profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProfile()
  }, [])

  const handleUpdateProfile = () => {
    router.push('/dashboard/updateprofile')
  }

  if (loading) return <Loading />
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

  return (
    <SidebarLayout>
      <div className="py-16">
        <Card className="max-w-3xl mx-auto bg-black/70 text-white p-6 shadow-md space-y-6">
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            )}
            <div className=''>
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p><span className="font-semibold">Name:</span> {user?.name}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><span className="font-semibold">Location:</span> {profile?.location || '-'}</p>
            <p><span className="font-semibold">Phone:</span> {profile?.phone || '-'}</p>
            <p><span className="font-semibold">Contact:</span> {profile?.contact || '-'}</p>
            <p><span className="font-semibold">Address:</span> {profile?.address || '-'}</p>
            <p><span className="font-semibold">Gender:</span> {profile?.gender || '-'}</p>
            <p><span className="font-semibold">Birthday:</span> {profile?.birthday || '-'}</p>
            <div className="md:col-span-2">
              <span className="font-semibold">Bio:</span>
              <p className="mt-1 text-sm text-gray-300">{profile?.bio || '-'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile} className="px-10">
              Update Profile
            </Button>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  )
}

export default ProfilePage
