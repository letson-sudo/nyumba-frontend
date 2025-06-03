'use client'

import { useEffect, useState } from 'react'
import SidebarLayout from '@/components/Layouts/SidebarLayout'
import { Card, CardContent } from '@/components/ui/card'

const ServiceProviderPreview = () => {
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    // Get the form data from localStorage
    const storedData = localStorage.getItem('serviceProviderData')
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  if (!formData) {
    return (
      <SidebarLayout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-gray-400">No service provider data submitted yet.</p>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl mb-6 text-center text-white">Service Provider Preview</h2>

        <Card className="shadow-lg bg-black/80">
          <CardContent className="p-6 text-gray-300 space-y-4">
            <div>
              <strong>Category:</strong> {formData.service}
            </div>
            <div>
              <strong>Sales:</strong> {formData.Sales}
            </div>
            <div>
              <strong>Price:</strong> {formData.contact}
            </div>
            <div>
              <strong>Location:</strong> {formData.company}
            </div>
            <div>
              <strong>Quantity:</strong> {formData.quantity}
            </div>
            <div>
              <strong>Description:</strong> {formData.extra}
            </div>

            {formData.mediaFiles && formData.mediaFiles.length > 0 && (
              <div>
                <strong>Uploaded Files:</strong>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {formData.mediaFiles.map((fileUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {fileUrl.endsWith('.mp4') || fileUrl.endsWith('.mov') ? (
                        <video src={fileUrl} controls className="w-full h-40 object-cover rounded" />
                      ) : (
                        <img src={fileUrl} alt="Media Preview" className="w-full h-40 object-cover rounded" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  )
}

export default ServiceProviderPreview
