
'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import {
  X,
  Home,
  MapPin,
  DollarSign,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Building2,
  Camera,
  Sparkles,
  Shield,
  TrendingUp,
  Save,
  Edit3
} from 'lucide-react'
import Input from '@/components/Input'
import Label from '@/components/Label'
import ImageUpload from './ImageUpload'

const AddPropertyForm = ({
  onClose,
  editMode = false,
  initialData = {},
  existingImages = [],
  onPropertyAdded
}) => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
  })

  useEffect(() => {
    if (editMode && initialData) {
      setForm({
        title: initialData.title || '',
        location: initialData.location || '',
        price: initialData.price || '',
        description: initialData.description || '',
      })
    }
  }, [editMode, initialData])

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imageStatus, setImageStatus] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (fileOrStatus) => {
    if (editMode) {
      // In edit mode, ImageUpload handles uploads internally
      // We just track the status for UI feedback
      setImageStatus(fileOrStatus)
      console.log('🖼️ Image status updated:', fileOrStatus)
    } else {
      // In add mode, store the file for upload after property creation
      setImageFile(fileOrStatus)
      console.log('📁 Image file selected:', fileOrStatus?.name)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSuccess(false)

    try {
      let response;
      let property;

      if (editMode) {
        // UPDATE MODE - Only update property data
        console.log('🔄 Updating property data...', form)
        response = await axios.put(`/api/properties/edit/${initialData.id}`, form, {
          withCredentials: true,
        })
        property = response.data?.property || response.data
        console.log('✅ Property updated successfully:', property)

        // Note: Image updates are handled separately by ImageUpload component
        // No need to handle image upload here in edit mode

      } else {
        // ADD MODE - Handle both property and image
        console.log('➕ Creating new property...', form)
        response = await axios.post('/api/properties', form, {
          withCredentials: true,
        })
        property = response.data?.property || response.data
        console.log('✅ Property created successfully:', property)

        // Handle image upload for new properties only
        if (imageFile && property?.id) {
          console.log('📷 Uploading image for new property...')
          const formData = new FormData()
          formData.append('property_id', property.id)
          formData.append('image', imageFile)

          try {
            const uploadResponse = await axios.post('/api/upload-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            })
            console.log('✅ Image uploaded:', uploadResponse.data?.url || uploadResponse.data)
          } catch (imageError) {
            console.error('⚠️ Image upload failed, but property was created:', imageError)
            // Don't fail the entire operation if image upload fails
            setErrors({
              general: ['Property created successfully, but image upload failed. You can add images later.']
            })
          }
        }
      }

      setSuccess(true)

      // Reset form only for add mode
      if (!editMode) {
        setForm({
          title: '',
          location: '',
          price: '',
          description: '',
        })
        setImageFile(null)
      }

      // Close form after a short delay to show success message
      setTimeout(() => {
        if (onPropertyAdded) {
          onPropertyAdded(property) // Pass the updated property back to parent
        } else {
          onClose(property)
        }
      }, 1500)

    } catch (error) {
      console.error('❌ Property submission failed:', error)
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else if (error.response?.status === 404) {
        setErrors({ general: ['Property not found. It may have been deleted.'] })
      } else if (error.response?.status === 403) {
        setErrors({ general: ['You do not have permission to edit this property.'] })
      } else if (error.response?.status === 401) {
        setErrors({ general: ['Please log in to continue.'] })
      } else {
        setErrors({ general: ['An error occurred. Please try again.'] })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[6001] bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md flex justify-center items-start pt-4 px-4">
      <div className="bg-white/95 backdrop-blur-xl max-w-3xl w-full rounded-3xl shadow-2xl border border-white/20 p-8 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-full p-2.5 transition-all duration-300 hover:rotate-90"
        >
          <X size={22} />
        </button>

        {/* Enhanced Header - Dynamic based on mode */}
        <div className="flex items-center gap-3 mb-10 relative">
          <div className="relative">
            <div className={`p-4 rounded-2xl shadow-lg ${
              editMode
                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              {editMode ? (
                <Edit3 className="text-white" size={28} />
              ) : (
                <Building2 className="text-white" size={28} />
              )}
            </div>
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-1">
              <Sparkles className="text-white" size={12} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {editMode ? 'Edit Property' : 'Add New Property'}
            </h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <Shield size={14} className="text-emerald-500" />
              {editMode ? 'Update property information and manage images' : 'Professional property listing with advanced features'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-100">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">
              {editMode ? 'Edit Mode' : 'Pro Listing'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field */}
          <div className="space-y-3 group">
            <Label htmlFor="title" className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg">
                <Home size={16} className="text-blue-600" />
              </div>
              Property Title
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-2xl px-5 py-4 text-sm transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                placeholder="e.g., Luxury 3BR Penthouse with City Views"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            {errors.title && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={16} />
                {Array.isArray(errors.title) ? errors.title[0] : errors.title}
              </div>
            )}
          </div>

          {/* Location and Price Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3 group">
              <Label htmlFor="location" className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-2 rounded-lg">
                  <MapPin size={16} className="text-emerald-600" />
                </div>
                Location
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-5 py-4 text-sm transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                  placeholder="e.g., Blantyre Central Business District"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              {errors.location && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle size={16} />
                  {Array.isArray(errors.location) ? errors.location[0] : errors.location}
                </div>
              )}
            </div>

            <div className="space-y-3 group">
              <Label htmlFor="price" className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-2 rounded-lg">
                  <DollarSign size={16} className="text-amber-600" />
                </div>
                Price (MWK)
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 rounded-2xl px-5 py-4 text-sm transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                  placeholder="e.g., 2,500,000"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              {errors.price && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertCircle size={16} />
                  {Array.isArray(errors.price) ? errors.price[0] : errors.price}
                </div>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-3 group">
            <Label htmlFor="description" className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg">
                <FileText size={16} className="text-purple-600" />
              </div>
              Property Description
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 rounded-2xl px-5 py-4 text-sm resize-none transition-all duration-300 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                placeholder="Describe your property in detail: features, amenities, nearby facilities, what makes it unique, and why tenants would love to live here..."
                required
              />
              <div className="absolute bottom-4 right-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            {errors.description && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={16} />
                {Array.isArray(errors.description) ? errors.description[0] : errors.description}
              </div>
            )}
          </div>

          {/* Enhanced Image Upload Section */}
          <div className="space-y-3">
            <ImageUpload
              onChange={handleImageChange}
              editMode={editMode}
              propertyId={editMode ? initialData.id : null}
              disabled={isSubmitting}
              existingImages={existingImages}
            />

            {/* Image Status Feedback for Edit Mode */}
            {editMode && imageStatus && (
              <div className="mt-3">
                {imageStatus.updated && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                    <CheckCircle size={16} />
                    Image updated successfully!
                  </div>
                )}
                {imageStatus.deleted && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <AlertCircle size={16} />
                    Image deleted successfully.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Success Message */}
          {success && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2 flex-shrink-0">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-800 text-lg mb-1">
                    {editMode ? 'Property Updated Successfully! 🎉' : 'Property Listed Successfully! 🎉'}
                  </h4>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    {editMode
                      ? 'Your property information has been updated and the changes are now live.'
                      : 'Your property has been added to our premium listings and is now visible to thousands of potential tenants. Expect inquiries to start coming in soon!'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Error Message */}
          {errors.general && (
            <div className="relative overflow-hidden bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border border-red-200 rounded-2xl p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 flex-shrink-0">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-800 text-lg mb-1">
                    {editMode ? 'Update Failed' : 'Submission Failed'}
                  </h4>
                  <p className="text-red-700 text-sm">
                    {Array.isArray(errors.general) ? errors.general.join(', ') : errors.general}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-8 py-4 rounded-2xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] transform ${
                editMode
                  ? 'bg-gradient-to-r from-amber-600 via-orange-700 to-amber-700 hover:from-amber-700 hover:via-orange-800 hover:to-amber-800'
                  : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{editMode ? 'Saving Changes...' : 'Publishing Property...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {editMode ? (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                      <Sparkles size={16} className="animate-pulse" />
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Publish Property</span>
                      <Sparkles size={16} className="animate-pulse" />
                    </>
                  )}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPropertyForm



