// first working by adding img only tested
'use client'
// import { useState, useRef } from 'react'
// import { Camera, Upload, X, Image, CheckCircle, FileImage, Sparkles } from 'lucide-react'

// export default function ImageUpload({ onChange }) {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)
//   const fileInputRef = useRef(null)

//   const handleFileChange = (file) => {
//     if (file && file.type.startsWith('image/')) {
//       console.log('📁 Image selected:', file.name)
//       setSelectedFile(file)
//       onChange && onChange(file)

//       // Create image preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleInputChange = (e) => {
//     const file = e.target.files[0]
//     handleFileChange(file)
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     setIsDragOver(true)
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//     const file = e.dataTransfer.files[0]
//     handleFileChange(file)
//   }

//   const handleRemove = () => {
//     console.log('❌ Image removed')
//     setSelectedFile(null)
//     setImagePreview(null)
//     onChange && onChange(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleClick = () => {
//     fileInputRef.current?.click()
//   }

//   return (
//     <div className="">
//       <label className="flex items-center gap-2 text-sm font-medium text-gray-700 py-3">
//         <div  className="bg-gradient-to-r from-rose-100 to-pink-100 p-2 rounded-lg">
//  <Camera size={16} className="text-rose-600" />
//         </div>

//         Property Images
//         <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Required</span>
//       </label>

//       <div className="relative">
//         <div
//           onClick={handleClick}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`
//             relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
//             ${isDragOver
//               ? 'border-blue-500 bg-blue-50 scale-[1.02]'
//               : selectedFile
//                 ? 'border-green-300 bg-green-50'
//                 : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
//             }
//           `}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleInputChange}
//             className="absolute inset-0 opacity-0 cursor-pointer"
//           />

//           {!selectedFile ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center">
//               {/* Upload Icon with Animation */}
//               <div className="relative mb-4">
//                 <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
//                   <Upload className={`w-8 h-8 text-blue-600 transition-transform duration-300 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`} />
//                 </div>
//                 {isDragOver && (
//                   <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
//                 )}
//               </div>

//               {/* Upload Text */}
//               <div className="space-y-2">
//                 <h4 className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
//                   {isDragOver ? 'Drop your image here' : 'Upload Property Image'}
//                 </h4>
//                 <p className="text-sm text-gray-500">
//                   Drag & drop or click to select
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Supports JPG, PNG, WebP (Max 10MB)
//                 </p>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
//                 <Sparkles size={20} className="text-blue-500" />
//               </div>
//             </div>
//           ) : (
//             <div className="p-4">
//               {/* Image Preview */}
//               {imagePreview && (
//                 <div className="mb-4 relative">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-32 object-cover rounded-xl border border-gray-200"
//                   />
//                   <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
//                 </div>
//               )}

//               {/* File Info */}
//               <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-green-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-green-100 p-2 rounded-lg">
//                     <FileImage className="w-5 h-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800 truncate max-w-48">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {/* Success Indicator */}
//                   <div className="bg-green-100 p-1.5 rounded-full">
//                     <CheckCircle className="w-4 h-4 text-green-600" />
//                   </div>

//                   {/* Remove Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleRemove()
//                     }}
//                     type="button"
//                     className="bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-200 group/remove"
//                     title="Remove image"
//                   >
//                     <X className="w-4 h-4 text-red-600 group-hover/remove:text-red-700" />
//                   </button>
//                 </div>
//               </div>

//               {/* Upload Another */}
//               <div className="mt-3 text-center">
//                 <span className="text-xs text-gray-500">
//                   Click to replace image
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Drag Overlay */}
//           {isDragOver && (
//             <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
//               <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
//                 <Upload className="w-5 h-5 inline mr-2" />
//                 Drop to upload
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Upload Tips */}

//       </div>
//     </div>
//   )
// }



//partialy works
// import { useState, useRef, useEffect } from 'react'
// import { Camera, Upload, X, Image, CheckCircle, FileImage, Sparkles, Edit3, Trash2, RefreshCw } from 'lucide-react'
// import axios from '@/lib/axios'

// export default function ImageUpload({
//   onChange,
//   editMode = false,
//   propertyId = null,
//   disabled = false,
//   existingImages = []
// }) {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)
//   const [currentImages, setCurrentImages] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [error, setError] = useState(null)
//   const fileInputRef = useRef(null)

//   // Initialize current images from props
//   useEffect(() => {
//     if (existingImages && Array.isArray(existingImages)) {
//       console.log('🖼️ Setting existing images:', existingImages)
//       setCurrentImages(existingImages)
//     } else if (editMode && propertyId && existingImages.length === 0) {
//       // Only fetch if no existing images provided and we're in edit mode
//       fetchExistingImages()
//     }
//   }, [existingImages, editMode, propertyId])

//   const fetchExistingImages = async () => {
//     if (!editMode || !propertyId) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       console.log('🖼️ Fetching existing images for property:', propertyId)

//       // Use the correct API endpoint that matches your backend
//       const response = await axios.get(`/api/properties/${propertyId}/images`, {
//         withCredentials: true,
//       })

//       console.log('📸 API Response:', response.data)

//       let images = []

//       // Handle different response formats
//       if (response.data && response.data.success && response.data.images) {
//         images = response.data.images
//       } else if (response.data && Array.isArray(response.data.images)) {
//         images = response.data.images
//       } else if (response.data && Array.isArray(response.data)) {
//         images = response.data
//       } else if (response.data && response.data.image_url) {
//         // Single image format
//         images = [{
//           id: response.data.id || 1,
//           img_url: response.data.image_url,
//           filename: response.data.filename || 'Property Image'
//         }]
//       }

//       console.log('✅ Processed images:', images)
//       setCurrentImages(images)

//     } catch (err) {
//       console.error('❌ Failed to fetch existing images:', err)

//       // Don't show error for 404 - it's normal when no images exist
//       if (err.response?.status !== 404) {
//         setError('Failed to load existing images')
//       } else {
//         console.log('ℹ️ No existing images found (404) - this is normal')
//         setCurrentImages([])
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleFileChange = (file) => {
//     if (file && file.type.startsWith('image/')) {
//       console.log('📁 New image selected:', file.name)
//       setSelectedFile(file)
//       setError(null)

//       // In add mode, call onChange immediately
//       if (!editMode) {
//         onChange && onChange(file)
//       }

//       // Create image preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleInputChange = (e) => {
//     const file = e.target.files[0]
//     handleFileChange(file)
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     if (!disabled) {
//       setIsDragOver(true)
//     }
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//     if (!disabled) {
//       const file = e.dataTransfer.files[0]
//       handleFileChange(file)
//     }
//   }

//   const handleUploadInEditMode = async () => {
//     if (!selectedFile || !propertyId) return

//     setIsUploading(true)
//     setError(null)

//     try {
//       console.log('🔄 Uploading new image in edit mode...')
//       const formData = new FormData()
//       formData.append('property_id', propertyId)
//       formData.append('image', selectedFile)

//       // Use the upload-image endpoint for consistency
//       const response = await axios.post('/api/upload-image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       })

//       console.log('✅ Image uploaded successfully:', response.data)

//       // Add new image to current images
//       const newImage = {
//         id: response.data.id || Date.now(),
//         img_url: response.data.url || response.data.image_url,
//         filename: selectedFile.name
//       }

//       const updatedImages = [...currentImages, newImage]
//       setCurrentImages(updatedImages)

//       // Clear the selected file and preview
//       setSelectedFile(null)
//       setImagePreview(null)

//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }

//       // Notify parent component
//       onChange && onChange({ updated: true, images: updatedImages, newImage })

//     } catch (error) {
//       console.error('❌ Image upload failed:', error)
//       setError(error.response?.data?.message || 'Failed to upload image')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleDeleteImage = async (imageId) => {
//     if (!imageId || !propertyId) return

//     setIsUploading(true)
//     setError(null)

//     try {
//       console.log('🗑️ Deleting image:', imageId)

//       // Use the correct delete endpoint
//       await axios.delete(`/api/properties/${propertyId}/images/${imageId}`, {
//         withCredentials: true,
//       })

//       console.log('✅ Image deleted successfully')

//       // Remove image from current images
//       const updatedImages = currentImages.filter(img => img.id !== imageId)
//       setCurrentImages(updatedImages)

//       // Notify parent component
//       onChange && onChange({ deleted: true, images: updatedImages, deletedImageId: imageId })

//     } catch (error) {
//       console.error('❌ Image deletion failed:', error)
//       setError(error.response?.data?.message || 'Failed to delete image')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleRemove = () => {
//     console.log('❌ Removing selected image')
//     setSelectedFile(null)
//     setImagePreview(null)
//     setError(null)
//     onChange && onChange(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleClick = () => {
//     if (!disabled) {
//       fileInputRef.current?.click()
//     }
//   }

//   // Show loading state when fetching existing images
//   if (isLoading) {
//     return (
//       <div className="">
//         <label className="flex items-center gap-2 text-sm font-medium text-gray-700 py-3">
//           <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-2 rounded-lg">
//             <Camera size={16} className="text-rose-600" />
//           </div>
//           Property Images
//           <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//             {editMode ? 'Optional' : 'Required'}
//           </span>
//         </label>

//         <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="bg-gray-200 p-4 rounded-full mb-4">
//               <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
//             </div>
//             <p className="text-gray-500">Loading existing images...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="">
//       <label className="flex items-center gap-2 text-sm font-medium text-gray-700 py-3">
//         <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-2 rounded-lg">
//           <Camera size={16} className="text-rose-600" />
//         </div>
//         Property Images
//         <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//           {editMode ? 'Optional' : 'Required'}
//         </span>
//         {currentImages.length > 0 && (
//           <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
//             {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
//           </span>
//         )}
//       </label>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
//           <X size={16} />
//           {error}
//         </div>
//       )}

//       <div className="relative space-y-4">
//         {/* Existing Images Display (Edit Mode) */}
//         {editMode && currentImages.length > 0 && (
//           <div className="space-y-3">
//             {currentImages.map((image, index) => (
//               <div key={image.id || index} className="rounded-2xl border-2 border-green-300 bg-green-50 overflow-hidden">
//                 <div className="p-4">
//                   {/* Current Image Preview */}
//                   <div className="mb-4 relative">
//                     <img
//                       src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.img_url}`}
//                       alt={`Property image ${index + 1}`}
//                       className="w-full h-48 object-cover rounded-xl border border-gray-200"
//                       onError={(e) => {
//                         console.error('Image failed to load:', image.img_url)
//                         e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>'
//                       }}
//                     />
//                     <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
//                     <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                       Image {index + 1}
//                     </div>
//                   </div>

//                   {/* Current Image Info */}
//                   <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-green-200">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-green-100 p-2 rounded-lg">
//                         <FileImage className="w-5 h-5 text-green-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-800 truncate max-w-48">
//                           {image.filename || `Property Image ${index + 1}`}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Current image
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       {/* Delete Button */}
//                       <button
//                         onClick={() => handleDeleteImage(image.id)}
//                         disabled={disabled || isUploading}
//                         type="button"
//                         className="bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-200 group/delete disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Delete image"
//                       >
//                         {isUploading ? (
//                           <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
//                         ) : (
//                           <Trash2 className="w-4 h-4 text-red-600 group-hover/delete:text-red-700" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* New Image Selection Area */}
//         <div
//           onClick={handleClick}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`
//             relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
//             ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
//             ${isDragOver && !disabled
//               ? 'border-blue-500 bg-blue-50 scale-[1.02]'
//               : selectedFile
//                 ? 'border-green-300 bg-green-50'
//                 : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
//             }
//           `}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleInputChange}
//             disabled={disabled}
//             className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
//           />

//           {!selectedFile ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center">
//               {/* Upload Icon with Animation */}
//               <div className="relative mb-4">
//                 <div className={`p-4 rounded-full transition-colors duration-300 ${
//                   disabled ? 'bg-gray-200' : 'bg-blue-100 group-hover:bg-blue-200'
//                 }`}>
//                   <Upload className={`w-8 h-8 transition-transform duration-300 ${
//                     disabled ? 'text-gray-400' : `text-blue-600 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`
//                   }`} />
//                 </div>
//                 {isDragOver && !disabled && (
//                   <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
//                 )}
//               </div>

//               {/* Upload Text */}
//               <div className="space-y-2">
//                 <h4 className={`text-lg font-semibold transition-colors ${
//                   disabled ? 'text-gray-400' :
//                   isDragOver ? 'text-blue-700' :
//                   editMode ? 'text-gray-600 group-hover:text-blue-700' :
//                   'text-gray-700 group-hover:text-blue-700'
//                 }`}>
//                   {isDragOver && !disabled ? 'Drop your image here' :
//                    editMode ? 'Add Another Image' :
//                    'Upload Property Image'}
//                 </h4>
//                 <p className="text-sm text-gray-500">
//                   {disabled ? 'Image upload disabled' : 'Drag & drop or click to select'}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Supports JPG, PNG, WebP (Max 10MB)
//                 </p>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
//                 <Sparkles size={20} className={disabled ? "text-gray-400" : "text-blue-500"} />
//               </div>
//             </div>
//           ) : (
//             <div className="p-4">
//               {/* New Image Preview */}
//               {imagePreview && (
//                 <div className="mb-4 relative">
//                   <img
//                     src={imagePreview}
//                     alt="New image preview"
//                     className="w-full h-32 object-cover rounded-xl border border-gray-200"
//                   />
//                   <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
//                   <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                     New Image
//                   </div>
//                 </div>
//               )}

//               {/* New File Info */}
//               <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-green-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-yellow-100 p-2 rounded-lg">
//                     <FileImage className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800 truncate max-w-48">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {editMode ? (
//                     <>
//                       {/* Upload Button (Edit Mode) */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           handleUploadInEditMode()
//                         }}
//                         disabled={isUploading}
//                         type="button"
//                         className="bg-green-100 hover:bg-green-200 p-1.5 rounded-full transition-colors duration-200 group/upload disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Upload new image"
//                       >
//                         {isUploading ? (
//                           <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />
//                         ) : (
//                           <Upload className="w-4 h-4 text-green-600 group-hover/upload:text-green-700" />
//                         )}
//                       </button>
//                     </>
//                   ) : (
//                     <div className="bg-green-100 p-1.5 rounded-full">
//                       <CheckCircle className="w-4 h-4 text-green-600" />
//                     </div>
//                   )}

//                   {/* Remove Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleRemove()
//                     }}
//                     disabled={isUploading}
//                     type="button"
//                     className="bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-200 group/remove disabled:opacity-50 disabled:cursor-not-allowed"
//                     title="Remove image"
//                   >
//                     <X className="w-4 h-4 text-red-600 group-hover/remove:text-red-700" />
//                   </button>
//                 </div>
//               </div>

//               {/* Upload Instructions */}
//               <div className="mt-3 text-center">
//                 <span className="text-xs text-gray-500">
//                   {editMode ?
//                     (isUploading ? 'Uploading...' : 'Click upload button to save changes') :
//                     'Ready to upload'
//                   }
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Drag Overlay */}
//           {isDragOver && !disabled && (
//             <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
//               <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
//                 <Upload className="w-5 h-5 inline mr-2" />
//                 Drop to upload
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

//secondly works
// import { useState, useRef, useEffect } from 'react'
// import { Camera, Upload, X, Image, CheckCircle, FileImage, Sparkles, Edit3, Trash2, RefreshCw } from 'lucide-react'
// import axios from 'axios'

// export default function ImageUpload({
//   onChange,
//   editMode = false,
//   propertyId = null,
//   disabled = false,
//   existingImages = []
// }) {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)
//   const [currentImages, setCurrentImages] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [error, setError] = useState(null)
//   const fileInputRef = useRef(null)

//   // Initialize current images from props
//   useEffect(() => {
//     if (existingImages && Array.isArray(existingImages)) {
//       console.log('🖼️ Setting existing images:', existingImages)
//       setCurrentImages(existingImages)
//     } else if (editMode && propertyId && existingImages.length === 0) {
//       // Only fetch if no existing images provided and we're in edit mode
//       fetchExistingImages()
//     }
//   }, [existingImages, editMode, propertyId])

//   const fetchExistingImages = async () => {
//     if (!editMode || !propertyId) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       console.log('🖼️ Fetching existing images for property:', propertyId)

//       // Use axios with your existing configuration
//       const response = await axios.get(`/api/property-image/${propertyId}`, {
//         withCredentials: true,
//       })

//       console.log('📸 API Response:', response.data)

//       let images = []

//       // Handle your controller's response format
//       if (response.data && response.data.status === 'success' && Array.isArray(response.data.images)) {
//         images = response.data.images
//       } else if (response.data && Array.isArray(response.data.images)) {
//         images = response.data.images
//       } else if (response.data && Array.isArray(response.data)) {
//         images = response.data
//       }

//       console.log('✅ Processed images:', images)
//       setCurrentImages(images)

//     } catch (err) {
//       console.error('❌ Failed to fetch existing images:', err)

//       // Don't show error for 404 - it's normal when no images exist
//       if (err.response?.status !== 404) {
//         setError('Failed to load existing images')
//       } else {
//         console.log('ℹ️ No existing images found (404) - this is normal')
//         setCurrentImages([])
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Helper function to get correct image URL
//   const getImageUrl = (imgUrl) => {
//     if (!imgUrl) return null

//     // If it's already a full URL, return as-is
//     if (imgUrl.startsWith('http')) {
//       return imgUrl
//     }

//     // Get the Laravel backend URL
//     const backendUrl = 'http://localhost:8000' // Hardcoded for now

//     // If it starts with /storage/, prepend backend URL
//     if (imgUrl.startsWith('/storage/')) {
//       return `${backendUrl}${imgUrl}`
//     }

//     // If it starts with storage/, add leading slash and backend URL
//     if (imgUrl.startsWith('storage/')) {
//       return `${backendUrl}/${imgUrl}`
//     }

//     // If it's just a path like 'property-images/filename.jpg', construct full URL
//     return `${backendUrl}/storage/${imgUrl}`
//   }

//   const handleFileChange = (file) => {
//     if (file && file.type.startsWith('image/')) {
//       console.log('📁 New image selected:', file.name)
//       setSelectedFile(file)
//       setError(null)

//       // In add mode, call onChange immediately
//       if (!editMode) {
//         onChange && onChange(file)
//       }

//       // Create image preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleInputChange = (e) => {
//     const file = e.target.files[0]
//     handleFileChange(file)
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     if (!disabled) {
//       setIsDragOver(true)
//     }
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//     if (!disabled) {
//       const file = e.dataTransfer.files[0]
//       handleFileChange(file)
//     }
//   }

//   const handleUploadInEditMode = async () => {
//     if (!selectedFile || !propertyId) return

//     setIsUploading(true)
//     setError(null)

//     try {
//       console.log('🔄 Uploading new image in edit mode...')
//       const formData = new FormData()
//       formData.append('images[]', selectedFile) // Use array format for consistency

//       // Use axios for the upload
//       const response = await axios.post(`/api/property-image/${propertyId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       })

//       console.log('✅ Image uploaded successfully:', response.data)

//       // Update with the returned images from the controller
//       if (response.data.status === 'success' && Array.isArray(response.data.images)) {
//         setCurrentImages(response.data.images)

//         // Clear the selected file and preview
//         setSelectedFile(null)
//         setImagePreview(null)

//         // Reset file input
//         if (fileInputRef.current) {
//           fileInputRef.current.value = ''
//         }

//         // Notify parent component
//         onChange && onChange({
//           updated: true,
//           images: response.data.images,
//           summary: response.data.summary
//         })
//       }

//     } catch (error) {
//       console.error('❌ Image upload failed:', error)
//       setError(error.response?.data?.message || 'Failed to upload image')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleDeleteImage = async (imageId) => {
//     if (!imageId || !propertyId) return

//     setIsUploading(true)
//     setError(null)

//     try {
//       console.log('🗑️ Deleting image:', imageId)

//       const formData = new FormData()
//       formData.append('deleted_image_ids[]', imageId)

//       // Use axios for deletion with your EditImageController update endpoint
//       const response = await axios.post(`/api/property-image/${propertyId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       })

//       console.log('✅ Image deleted successfully:', response.data)

//       // Update with the returned images from the controller
//       if (response.data.status === 'success' && Array.isArray(response.data.images)) {
//         setCurrentImages(response.data.images)

//         // Notify parent component
//         onChange && onChange({
//           deleted: true,
//           images: response.data.images,
//           deletedImageId: imageId,
//           summary: response.data.summary
//         })
//       }

//     } catch (error) {
//       console.error('❌ Image deletion failed:', error)
//       setError(error.response?.data?.message || 'Failed to delete image')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleRemove = () => {
//     console.log('❌ Removing selected image')
//     setSelectedFile(null)
//     setImagePreview(null)
//     setError(null)
//     onChange && onChange(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleClick = () => {
//     if (!disabled) {
//       fileInputRef.current?.click()
//     }
//   }

//   // Show loading state when fetching existing images
//   if (isLoading) {
//     return (
//       <div className="">
//         <label className="flex items-center gap-2 text-sm font-medium text-gray-700 py-3">
//           <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-2 rounded-lg">
//             <Camera size={16} className="text-rose-600" />
//           </div>
//           Property Images
//           <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//             {editMode ? 'Optional' : 'Required'}
//           </span>
//         </label>

//         <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="bg-gray-200 p-4 rounded-full mb-4">
//               <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
//             </div>
//             <p className="text-gray-500">Loading existing images...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="">
//       <label className="flex items-center gap-2 text-sm font-medium text-gray-700 py-3">
//         <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-2 rounded-lg">
//           <Camera size={16} className="text-rose-600" />
//         </div>
//         Property Images
//         <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//           {editMode ? 'Optional' : 'Required'}
//         </span>
//         {currentImages.length > 0 && (
//           <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
//             {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
//           </span>
//         )}
//       </label>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
//           <X size={16} />
//           {error}
//         </div>
//       )}

//       <div className="relative space-y-4">
//         {/* Existing Images Display (Edit Mode) */}
//         {editMode && currentImages.length > 0 && (
//           <div className="space-y-3">
//             {currentImages.map((image, index) => {
//               const imageUrl = getImageUrl(image.img_url || image.url)

//               return (
//                 <div key={image.id || index} className="rounded-2xl border-2 border-green-300 bg-green-50 overflow-hidden">
//                   <div className="p-4">
//                     {/* Current Image Preview */}
//                     <div className="mb-4 relative">
//                       <img
//                         src={imageUrl}
//                         alt={`Property image ${index + 1}`}
//                         className="w-full h-48 object-cover rounded-xl border border-gray-200"
//                         onLoad={() => {
//                           console.log('✅ Image loaded successfully:', imageUrl)
//                         }}
//                         onError={(e) => {
//                           console.error('❌ Image failed to load:', imageUrl)

//                           const originalSrc = e.target.src
//                           const backendUrl = 'http://localhost:8000' // Hardcoded for now

//                           // Try different URL variations
//                           const urlVariations = [
//                             `${backendUrl}/storage/${image.img_url?.replace(/^(\/storage\/|storage\/)/, '')}`,
//                             `${backendUrl}${image.img_url}`,
//                             `${backendUrl}/storage/property-images/${image.img_url?.split('/').pop()}`
//                           ]

//                           // Find the first variation that hasn't been tried yet
//                           const nextUrl = urlVariations.find(url => url !== originalSrc)

//                           if (nextUrl) {
//                             console.log('🔄 Trying alternative URL:', nextUrl)
//                             e.target.src = nextUrl
//                           } else {
//                             // Show placeholder if all attempts fail
//                             console.log('❌ All URL attempts failed, showing placeholder')
//                             e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f3f4f6"/><text x="200" y="100" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image Not Found</text></svg>'
//                           }
//                         }}
//                       />
//                       <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
//                       <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
//                         Image {index + 1}
//                       </div>
//                     </div>

//                     {/* Current Image Info */}
//                     <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-green-200">
//                       <div className="flex items-center gap-3">
//                         <div className="bg-green-100 p-2 rounded-lg">
//                           <FileImage className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-800 truncate max-w-48">
//                             {image.filename || `Property Image ${index + 1}`}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             Current image • ID: {image.id}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {/* Delete Button */}
//                         <button
//                           onClick={() => handleDeleteImage(image.id)}
//                           disabled={disabled || isUploading}
//                           type="button"
//                           className="bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-200 group/delete disabled:opacity-50 disabled:cursor-not-allowed"
//                           title="Delete image"
//                         >
//                           {isUploading ? (
//                             <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
//                           ) : (
//                             <Trash2 className="w-4 h-4 text-red-600 group-hover/delete:text-red-700" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}

//         {/* New Image Selection Area */}
//         <div
//           onClick={handleClick}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`
//             relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
//             ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
//             ${isDragOver && !disabled
//               ? 'border-blue-500 bg-blue-50 scale-[1.02]'
//               : selectedFile
//                 ? 'border-green-300 bg-green-50'
//                 : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
//             }
//           `}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleInputChange}
//             disabled={disabled}
//             className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
//           />

//           {!selectedFile ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center">
//               {/* Upload Icon with Animation */}
//               <div className="relative mb-4">
//                 <div className={`p-4 rounded-full transition-colors duration-300 ${
//                   disabled ? 'bg-gray-200' : 'bg-blue-100 group-hover:bg-blue-200'
//                 }`}>
//                   <Upload className={`w-8 h-8 transition-transform duration-300 ${
//                     disabled ? 'text-gray-400' : `text-blue-600 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`
//                   }`} />
//                 </div>
//                 {isDragOver && !disabled && (
//                   <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
//                 )}
//               </div>

//               {/* Upload Text */}
//               <div className="space-y-2">
//                 <h4 className={`text-lg font-semibold transition-colors ${
//                   disabled ? 'text-gray-400' :
//                   isDragOver ? 'text-blue-700' :
//                   editMode ? 'text-gray-600 group-hover:text-blue-700' :
//                   'text-gray-700 group-hover:text-blue-700'
//                 }`}>
//                   {isDragOver && !disabled ? 'Drop your image here' :
//                    editMode ? 'Add Another Image' :
//                    'Upload Property Image'}
//                 </h4>
//                 <p className="text-sm text-gray-500">
//                   {disabled ? 'Image upload disabled' : 'Drag & drop or click to select'}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Supports JPG, PNG, WebP (Max 10MB)
//                 </p>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
//                 <Sparkles size={20} className={disabled ? "text-gray-400" : "text-blue-500"} />
//               </div>
//             </div>
//           ) : (
//             <div className="p-4">
//               {/* New Image Preview */}
//               {imagePreview && (
//                 <div className="mb-4 relative">
//                   <img
//                     src={imagePreview}
//                     alt="New image preview"
//                     className="w-full h-32 object-cover rounded-xl border border-gray-200"
//                   />
//                   <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
//                   <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
//                     New Image
//                   </div>
//                 </div>
//               )}

//               {/* New File Info */}
//               <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-green-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-yellow-100 p-2 rounded-lg">
//                     <FileImage className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800 truncate max-w-48">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {editMode ? (
//                     <>
//                       {/* Upload Button (Edit Mode) */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           handleUploadInEditMode()
//                         }}
//                         disabled={isUploading}
//                         type="button"
//                         className="bg-green-100 hover:bg-green-200 p-1.5 rounded-full transition-colors duration-200 group/upload disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Upload new image"
//                       >
//                         {isUploading ? (
//                           <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />
//                         ) : (
//                           <Upload className="w-4 h-4 text-green-600 group-hover/upload:text-green-700" />
//                         )}
//                       </button>
//                     </>
//                   ) : (
//                     <div className="bg-green-100 p-1.5 rounded-full">
//                       <CheckCircle className="w-4 h-4 text-green-600" />
//                     </div>
//                   )}

//                   {/* Remove Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleRemove()
//                     }}
//                     disabled={isUploading}
//                     type="button"
//                     className="bg-red-100 hover:bg-red-200 p-1.5 rounded-full transition-colors duration-200 group/remove disabled:opacity-50 disabled:cursor-not-allowed"
//                     title="Remove image"
//                   >
//                     <X className="w-4 h-4 text-red-600 group-hover/remove:text-red-700" />
//                   </button>
//                 </div>
//               </div>

//               {/* Upload Instructions */}
//               <div className="mt-3 text-center">
//                 <span className="text-xs text-gray-500">
//                   {editMode ?
//                     (isUploading ? 'Uploading...' : 'Click upload button to save changes') :
//                     'Ready to upload'
//                   }
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Drag Overlay */}
//           {isDragOver && !disabled && (
//             <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
//               <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
//                 <Upload className="w-5 h-5 inline mr-2" />
//                 Drop to upload
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

//third works with upload other img in edit mode
import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, X, Image, CheckCircle, FileImage, Sparkles, Edit3, Trash2, RefreshCw } from 'lucide-react'
import axios from 'axios'

export default function ImageUpload({
  onChange,
  editMode = false,
  propertyId = null,
  disabled = false,
  existingImages = []
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImages, setCurrentImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Initialize current images from props
  useEffect(() => {
    if (existingImages && Array.isArray(existingImages)) {
      console.log('Setting existing images:', existingImages)
      setCurrentImages(existingImages)
    } else if (editMode && propertyId && existingImages.length === 0) {
      // Only fetch if no existing images provided and we're in edit mode
      fetchExistingImages()
    }
  }, [existingImages, editMode, propertyId])

  const fetchExistingImages = async () => {
    if (!editMode || !propertyId) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('Fetching existing images for property:', propertyId)

      // Try multiple possible endpoints for fetching images
      const possibleEndpoints = [
        `/api/property-image/${propertyId}`,
        `/api/properties/${propertyId}/images`,
        `/api/images/${propertyId}`,
      ];

      let response;
      let images = [];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying fetch endpoint: ${endpoint}`)
          response = await axios.get(endpoint, {
            withCredentials: true,
          })

          console.log(`Success with endpoint ${endpoint}:`, response.data)

          // Handle your controller's response format
          if (response.data && response.data.status === 'success' && Array.isArray(response.data.images)) {
            images = response.data.images
          } else if (response.data && Array.isArray(response.data.images)) {
            images = response.data.images
          } else if (response.data && Array.isArray(response.data)) {
            images = response.data
          }

          break; // Success, exit the loop

        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError.response?.status || endpointError.message)
          if (endpoint === possibleEndpoints[possibleEndpoints.length - 1]) {
            // This was the last endpoint
            if (endpointError.response?.status === 404) {
              console.log('No existing images found (404) - this is normal')
              images = []
            } else {
              throw endpointError;
            }
          }
          continue;
        }
      }

      console.log('Final processed images:', images)
      setCurrentImages(images)

    } catch (err) {
      console.error('Failed to fetch existing images from all endpoints:', err)

      // Don't show error for 404 - it's normal when no images exist
      if (err.response?.status !== 404) {
        setError(`Failed to load existing images: ${err.response?.data?.message || err.message}`)
      } else {
        setCurrentImages([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get correct image URL
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null

    // If it's already a full URL, return as-is
    if (imgUrl.startsWith('http')) {
      return imgUrl
    }

    // Get the Laravel backend URL
    const backendUrl = 'http://localhost:8000' // Hardcoded for now

    // If it starts with /storage/, prepend backend URL
    if (imgUrl.startsWith('/storage/')) {
      return `${backendUrl}${imgUrl}`
    }

    // If it starts with storage/, add leading slash and backend URL
    if (imgUrl.startsWith('storage/')) {
      return `${backendUrl}/${imgUrl}`
    }

    // If it's just a path like 'property-images/filename.jpg', construct full URL
    return `${backendUrl}/storage/${imgUrl}`
  }

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      console.log('New image selected:', file.name)
      setSelectedFile(file)
      setError(null)

      // For both modes, pass the file to parent for handling
      onChange && onChange(file)

      // Create image preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!disabled) {
      const file = e.dataTransfer.files[0]
      handleFileChange(file)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!imageId) return;

    // Only allow delete in edit mode - FIXED: changed 'mode' to 'editMode'
    if (!editMode) {
      console.warn('Delete is only allowed in edit mode');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log('Deleting image:', imageId);

      const response = await axios.delete(
        `http://localhost:8000/api/delete/images/${imageId}`,
        { withCredentials: true }
      );

      console.log('Image deleted successfully:', response.data);

      // Update local state
      setCurrentImages(currentImages.filter(img => img.id !== imageId));

      // Notify parent
      onChange &&
        onChange({
          deleted: true,
          images: currentImages.filter(img => img.id !== imageId),
          deletedImageId: imageId,
          summary: 'Image deleted successfully',
        });
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError(
        `Failed to delete image: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    console.log('Removing selected image')
    setSelectedFile(null)
    setImagePreview(null)
    setError(null)
    onChange && onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  // Show loading state when fetching existing images
  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
          <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm p-2 rounded-lg border border-rose-200/30">
            <Camera size={16} className="text-rose-600" />
          </div>
          Property Images
          <span className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-blue-200/30">
            {editMode ? 'Optional' : 'Required'}
          </span>
        </label>

        <div className="rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/50 backdrop-blur-sm p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-slate-200/80 backdrop-blur-sm p-4 rounded-full mb-4 border border-slate-300/50">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
            <p className="text-slate-500">Loading existing images...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
        <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm p-2 rounded-lg border border-rose-200/30">
          <Camera size={16} className="text-rose-600" />
        </div>
        Property Images
        <span className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-blue-200/30">
          {editMode ? 'Optional' : 'Required'}
        </span>
        {currentImages.length > 0 && (
          <span className="bg-green-100/80 text-green-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-green-200/30">
            {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
          </span>
        )}
      </label>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <X size={16} />
          {error}
        </div>
      )}

      <div className="relative space-y-4">
        {/* Existing Images Display (Edit Mode) */}
        {editMode && currentImages.length > 0 && (
          <div className="space-y-3">
            {currentImages.map((image, index) => {
              const imageUrl = getImageUrl(image.img_url || image.url)

              return (
                <div key={image.id || index} className="rounded-2xl border-2 border-green-400/60 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm overflow-hidden shadow-sm">
                  <div className="p-4">
                    {/* Current Image Preview */}
                    <div className="mb-4 relative group">
                      <img
                        src={imageUrl}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                        onLoad={() => {
                          console.log('Image loaded successfully:', imageUrl)
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl)

                          const originalSrc = e.target.src
                          const backendUrl = 'http://localhost:8000'

                          // Try different URL variations
                          const urlVariations = [
                            `${backendUrl}/storage/${image.img_url?.replace(/^(\/storage\/|storage\/)/, '')}`,
                            `${backendUrl}${image.img_url}`,
                            `${backendUrl}/storage/property-images/${image.img_url?.split('/').pop()}`
                          ]

                          // Find the first variation that hasn't been tried yet
                          const nextUrl = urlVariations.find(url => url !== originalSrc)

                          if (nextUrl) {
                            console.log('Trying alternative URL:', nextUrl)
                            e.target.src = nextUrl
                          } else {
                            // Show placeholder if all attempts fail
                            console.log('All URL attempts failed, showing placeholder')
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f3f4f6"/><text x="200" y="100" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image Not Found</text></svg>'
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200/50">
                        Image {index + 1}
                      </div>
                    </div>

                    {/* Current Image Info */}
                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100/80 backdrop-blur-sm p-2 rounded-lg border border-green-200/50">
                          <FileImage className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-48">
                            {image.filename || `Property Image ${index + 1}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            Current image • ID: {image.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={disabled || isUploading}
                          type="button"
                          className="bg-red-100/80 hover:bg-red-200/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group/delete disabled:opacity-50 disabled:cursor-not-allowed border border-red-200/50 hover:border-red-300/50"
                          title="Delete image"
                        >
                          {isUploading ? (
                            <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-600 group-hover/delete:text-red-700 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* New Image Selection Area */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-sm
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isDragOver && !disabled
              ? 'border-blue-400/80 bg-blue-50/80 scale-[1.02] shadow-lg'
              : selectedFile
                ? 'border-green-400/80 bg-green-50/80 shadow-md'
                : 'border-slate-300/80 bg-white/50 hover:border-blue-400/60 hover:bg-blue-50/60 hover:shadow-md'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              {/* Upload Icon with Animation */}
              <div className="relative mb-4">
                <div className={`p-4 rounded-full transition-all duration-300 backdrop-blur-sm border shadow-sm ${
                  disabled
                    ? 'bg-slate-200/80 border-slate-300/50'
                    : 'bg-blue-100/80 group-hover:bg-blue-200/80 border-blue-200/50 group-hover:border-blue-300/50'
                }`}>
                  <Upload className={`w-8 h-8 transition-all duration-300 ${
                    disabled ? 'text-slate-400' : `text-blue-600 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`
                  }`} />
                </div>
                {isDragOver && !disabled && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                )}
              </div>

              {/* Upload Text */}
              <div className="space-y-2">
                <h4 className={`text-lg font-semibold transition-colors ${
                  disabled ? 'text-slate-400' :
                  isDragOver ? 'text-blue-700' :
                  editMode ? 'text-slate-600 group-hover:text-blue-700' :
                  'text-slate-700 group-hover:text-blue-700'
                }`}>
                  {isDragOver && !disabled ? 'Drop your image here' :
                   editMode ? 'Add Another Image' :
                   'Upload Property Image'}
                </h4>
                <p className="text-sm text-slate-500">
                  {disabled ? 'Image upload disabled' : 'Drag & drop or click to select'}
                </p>
                <p className="text-xs text-slate-400">
                  Supports JPG, PNG, WebP (Max 10MB)
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles size={20} className={disabled ? "text-slate-400" : "text-blue-500"} />
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* New Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative group">
                  <img
                    src={imagePreview}
                    alt="New image preview"
                    className="w-full h-32 object-cover rounded-xl border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-amber-800 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200/50">
                    New Image
                  </div>
                </div>
              )}

              {/* New File Info */}
              <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100/80 backdrop-blur-sm p-2 rounded-lg border border-yellow-200/50">
                    <FileImage className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-48">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!editMode && (
                    <div className="bg-green-100/80 backdrop-blur-sm p-2 rounded-full border border-green-200/50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    disabled={isUploading}
                    type="button"
                    className="bg-red-100/80 hover:bg-red-200/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group/remove disabled:opacity-50 disabled:cursor-not-allowed border border-red-200/50 hover:border-red-300/50"
                    title="Remove image"
                  >
                    <X className="w-4 h-4 text-red-600 group-hover/remove:text-red-700 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Upload Instructions */}
              <div className="mt-3 text-center">
                <span className="text-xs text-slate-500">
                  {editMode ?
                    'Click "Save Changes" to upload this image along with property updates' :
                    'Image ready for upload'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Drag Overlay */}
          {isDragOver && !disabled && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center border-2 border-blue-400/80 rounded-2xl">
              <div className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium shadow-lg border border-blue-400/50">
                <Upload className="w-5 h-5 inline mr-2" />
                Drop to upload
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



//forth under testing and failed to delete with 419 error
// import { useState, useRef, useEffect } from 'react'
// import { Camera, Upload, X, Image, CheckCircle, FileImage, Sparkles, Edit3, Trash2, RefreshCw } from 'lucide-react'
// import axios from 'axios'

// // Configure axios base URL for Laravel backend
// const API_BASE_URL = 'http://localhost:8000'

// // Configure axios defaults for CSRF protection
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// export default function ImageUpload({
//   onChange,
//   editMode = false,
//   propertyId = null,
//   disabled = false,
//   existingImages = []
// }) {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [isDragOver, setIsDragOver] = useState(false)
//   const [imagePreview, setImagePreview] = useState(null)
//   const [currentImages, setCurrentImages] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [error, setError] = useState(null)
//   const [deletingImageId, setDeletingImageId] = useState(null)
//   const [csrfToken, setCsrfToken] = useState(null)
//   const fileInputRef = useRef(null)

//   // Get CSRF token on component mount
//   useEffect(() => {
//     initializeCsrf()
//   }, [])

//   // Initialize current images from props
//   useEffect(() => {
//     if (existingImages && Array.isArray(existingImages)) {
//       console.log('Setting existing images:', existingImages)
//       setCurrentImages(existingImages)
//     } else if (editMode && propertyId && existingImages.length === 0) {
//       // Only fetch if no existing images provided and we're in edit mode
//       fetchExistingImages()
//     }
//   }, [existingImages, editMode, propertyId])

//   const initializeCsrf = async () => {
//     try {
//       console.log('Initializing CSRF token...')

//       // First, get the CSRF cookie from Sanctum
//       await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
//         withCredentials: true,
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       })

//       console.log('CSRF cookie request completed')

//       // Wait a bit for cookie to be set
//       await new Promise(resolve => setTimeout(resolve, 100))

//       // Try to get token from cookie first (most reliable for Sanctum)
//       let token = getCsrfTokenFromCookie()

//       // If no token from cookie, try meta tag
//       if (!token) {
//         token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
//       }

//       // If still no token, try API endpoint
//       if (!token) {
//         console.log('No token found in cookie or meta, trying API endpoint...')
//         try {
//           const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
//             withCredentials: true,
//             headers: {
//               'Accept': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           })
//           if (response.data.token) {
//             token = response.data.token
//           }
//         } catch (apiError) {
//           console.warn('API token endpoint failed:', apiError)
//         }
//       }

//       if (token) {
//         console.log('CSRF token obtained successfully')
//         setCsrfToken(token)
//         // Set default header for all future requests
//         axios.defaults.headers.common['X-CSRF-TOKEN'] = token
//       } else {
//         console.warn('No CSRF token could be obtained')
//       }
//     } catch (error) {
//       console.error('Failed to initialize CSRF token:', error)
//     }
//   }

//   const getCsrfTokenFromCookie = () => {
//     const cookies = document.cookie.split(';')
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=')
//       // Laravel Sanctum uses XSRF-TOKEN cookie
//       if (name === 'XSRF-TOKEN') {
//         // Decode the URL-encoded cookie value
//         return decodeURIComponent(value)
//       }
//       // Also check for laravel_session cookie pattern
//       if (name.includes('laravel_session')) {
//         console.log('Found Laravel session cookie')
//       }
//     }
//     console.log('Available cookies:', document.cookie)
//     return null
//   }

//   const getAuthenticatedAxiosConfig = () => {
//     const config = {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest'
//       }
//     }

//     // Add CSRF token if available
//     if (csrfToken) {
//       config.headers['X-CSRF-TOKEN'] = csrfToken
//     }

//     return config
//   }

//   const fetchExistingImages = async () => {
//     if (!editMode || !propertyId) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       console.log('Fetching existing images for property:', propertyId)

//       const possibleEndpoints = [
//         `${API_BASE_URL}/api/property-image/${propertyId}`,
//         `${API_BASE_URL}/api/properties/${propertyId}/images`,
//         `${API_BASE_URL}/api/images/${propertyId}`,
//       ]

//       let response
//       let images = []

//       for (const endpoint of possibleEndpoints) {
//         try {
//           console.log(`Trying fetch endpoint: ${endpoint}`)
//           response = await axios.get(endpoint, getAuthenticatedAxiosConfig())

//           console.log(`Success with endpoint ${endpoint}:`, response.data)

//           // Handle your controller's response format
//           if (response.data && response.data.status === 'success' && Array.isArray(response.data.images)) {
//             images = response.data.images
//           } else if (response.data && Array.isArray(response.data.images)) {
//             images = response.data.images
//           } else if (response.data && Array.isArray(response.data)) {
//             images = response.data
//           }

//           break // Success, exit the loop

//         } catch (endpointError) {
//           console.log(`Endpoint ${endpoint} failed:`, endpointError.response?.status || endpointError.message)
//           if (endpoint === possibleEndpoints[possibleEndpoints.length - 1]) {
//             if (endpointError.response?.status === 404) {
//               console.log('No existing images found (404) - this is normal')
//               images = []
//             } else {
//               throw endpointError
//             }
//           }
//           continue
//         }
//       }

//       console.log('Final processed images:', images)
//       setCurrentImages(images)

//     } catch (err) {
//       console.error('Failed to fetch existing images from all endpoints:', err)

//       if (err.response?.status !== 404) {
//         setError(`Failed to load existing images: ${err.response?.data?.message || err.message}`)
//       } else {
//         setCurrentImages([])
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getImageUrl = (imgUrl) => {
//     if (!imgUrl) return null

//     if (imgUrl.startsWith('http')) {
//       return imgUrl
//     }

//     const backendUrl = API_BASE_URL

//     if (imgUrl.startsWith('/storage/')) {
//       return `${backendUrl}${imgUrl}`
//     }

//     if (imgUrl.startsWith('storage/')) {
//       return `${backendUrl}/${imgUrl}`
//     }

//     return `${backendUrl}/storage/${imgUrl}`
//   }

//   const handleFileChange = (file) => {
//     if (file && file.type.startsWith('image/')) {
//       console.log('New image selected:', file.name)
//       setSelectedFile(file)
//       setError(null)

//       onChange && onChange(file)

//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleInputChange = (e) => {
//     const file = e.target.files[0]
//     handleFileChange(file)
//   }

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     if (!disabled) {
//       setIsDragOver(true)
//     }
//   }

//   const handleDragLeave = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setIsDragOver(false)
//     if (!disabled) {
//       const file = e.dataTransfer.files[0]
//       handleFileChange(file)
//     }
//   }

//   const handleDeleteImage = async (imageId) => {
//     if (!imageId || !editMode || !propertyId) {
//       console.warn('Delete operation only available in edit mode with propertyId')
//       return
//     }

//     setDeletingImageId(imageId)
//     setError(null)

//     try {
//       console.log('Starting delete process for image:', imageId, 'property:', propertyId)

//       let response
//       let maxRetries = 3
//       let currentRetry = 0

//       while (currentRetry <= maxRetries) {
//         try {
//           console.log(`Delete attempt ${currentRetry + 1}/${maxRetries + 1}`)

//           // Always refresh CSRF token before each attempt
//           await initializeCsrf()

//           // Wait a moment for token to be set
//           await new Promise(resolve => setTimeout(resolve, 200))

//           console.log('Current CSRF token:', csrfToken)
//           console.log('Available cookies:', document.cookie)

//           const config = {
//             withCredentials: true,
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//               'X-Requested-With': 'XMLHttpRequest'
//             }
//           }

//           // Add CSRF token if available
//           if (csrfToken) {
//             config.headers['X-CSRF-TOKEN'] = csrfToken
//           }

//           // Also try adding token from cookie directly
//           const cookieToken = getCsrfTokenFromCookie()
//           if (cookieToken && cookieToken !== csrfToken) {
//             console.log('Using cookie token as backup:', cookieToken)
//             config.headers['X-CSRF-TOKEN'] = cookieToken
//           }

//           console.log('Request config:', config)

//           response = await axios.delete(
//             `${API_BASE_URL}/api/property-image/${propertyId}/image/${imageId}`,
//             config
//           )

//           console.log('Delete request successful!')
//           break // Success, exit retry loop

//         } catch (error) {
//           console.log(`Delete attempt ${currentRetry + 1} failed:`, {
//             status: error.response?.status,
//             statusText: error.response?.statusText,
//             message: error.response?.data?.message,
//             headers: error.response?.headers
//           })

//           // If CSRF token mismatch or session expired
//           if (error.response?.status === 419) {
//             if (currentRetry < maxRetries) {
//               console.log('CSRF/Session issue, waiting and retrying...')
//               // Wait longer between retries for session issues
//               await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetry + 1)))
//               currentRetry++
//               continue
//             }
//           }

//           // If authentication issue
//           if (error.response?.status === 401) {
//             throw new Error('Authentication required. Please log in again.')
//           }

//           // If permission issue
//           if (error.response?.status === 403) {
//             throw new Error('You do not have permission to delete this image.')
//           }

//           // For other errors or max retries reached
//           throw error
//         }
//       }

//       console.log('Image deleted successfully:', response.data)

//       if (response.data && response.data.status === 'success') {
//         if (response.data.remaining_images && Array.isArray(response.data.remaining_images)) {
//           setCurrentImages(response.data.remaining_images)
//         } else {
//           setCurrentImages(prevImages => prevImages.filter(img => img.id !== imageId))
//         }

//         onChange && onChange({
//           deleted: true,
//           images: response.data.remaining_images || currentImages.filter(img => img.id !== imageId),
//           deletedImageId: imageId,
//           summary: response.data?.summary || 'Image deleted successfully'
//         })
//       }

//     } catch (error) {
//       console.error('Failed to delete image after all retries:', error)

//       let errorMessage = 'Unknown error'

//       if (error.message && !error.response) {
//         // Custom error messages we threw
//         errorMessage = error.message
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message
//       } else if (error.response?.status === 419) {
//         errorMessage = 'Security token expired. Please refresh the page and try again.'
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Authentication required. Please log in and try again.'
//       } else if (error.response?.status === 403) {
//         errorMessage = 'You do not have permission to delete this image.'
//       } else if (error.response?.status === 404) {
//         errorMessage = 'Image not found on server.'
//       } else if (error.response?.status >= 500) {
//         errorMessage = 'Server error. Please try again later.'
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       setError(`Failed to delete image: ${errorMessage}`)

//       // If the error is 404, the image might already be deleted
//       if (error.response?.status === 404) {
//         setCurrentImages(prevImages => prevImages.filter(img => img.id !== imageId))
//         onChange && onChange({
//           deleted: true,
//           images: currentImages.filter(img => img.id !== imageId),
//           deletedImageId: imageId,
//           summary: 'Image removed (not found on server)'
//         })
//       }
//     } finally {
//       setDeletingImageId(null)
//     }
//   }

//   const handleRemove = () => {
//     console.log('Removing selected image')
//     setSelectedFile(null)
//     setImagePreview(null)
//     setError(null)
//     onChange && onChange(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleClick = () => {
//     if (!disabled) {
//       fileInputRef.current?.click()
//     }
//   }

//   // Show loading state when fetching existing images
//   if (isLoading) {
//     return (
//       <div className="space-y-3">
//         <label className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
//           <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm p-2 rounded-lg border border-rose-200/30">
//             <Camera size={16} className="text-rose-600" />
//           </div>
//           Property Images
//           <span className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-blue-200/30">
//             {editMode ? 'Optional' : 'Required'}
//           </span>
//         </label>

//         <div className="rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/50 backdrop-blur-sm p-8">
//           <div className="flex flex-col items-center justify-center text-center">
//             <div className="bg-slate-200/80 backdrop-blur-sm p-4 rounded-full mb-4 border border-slate-300/50">
//               <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
//             </div>
//             <p className="text-slate-500">Loading existing images...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <label className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
//         <div className="bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm p-2 rounded-lg border border-rose-200/30">
//           <Camera size={16} className="text-rose-600" />
//         </div>
//         Property Images
//         <span className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-blue-200/30">
//           {editMode ? 'Optional' : 'Required'}
//         </span>
//         {currentImages.length > 0 && (
//           <span className="bg-green-100/80 text-green-700 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-green-200/30">
//             {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
//           </span>
//         )}
//       </label>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
//           <X size={16} />
//           {error}
//           {error.includes('Security token expired') && (
//             <button
//               onClick={initializeCsrf}
//               className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
//             >
//               Refresh Token
//             </button>
//           )}
//         </div>
//       )}

//       <div className="relative space-y-4">
//         {/* Existing Images Display (Edit Mode Only) */}
//         {editMode && currentImages.length > 0 && (
//           <div className="space-y-3">
//             {currentImages.map((image, index) => {
//               const imageUrl = getImageUrl(image.img_url || image.url)
//               const isDeleting = deletingImageId === image.id

//               return (
//                 <div key={image.id || index} className="rounded-2xl border-2 border-green-400/60 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm overflow-hidden shadow-sm">
//                   <div className="p-4">
//                     {/* Current Image Preview */}
//                     <div className="mb-4 relative group">
//                       <img
//                         src={imageUrl}
//                         alt={`Property image ${index + 1}`}
//                         className={`w-full h-48 object-cover rounded-xl border border-white/50 shadow-sm transition-all duration-300 group-hover:scale-[1.02] ${
//                           isDeleting ? 'opacity-50 grayscale' : ''
//                         }`}
//                         onLoad={() => {
//                           console.log('Image loaded successfully:', imageUrl)
//                         }}
//                         onError={(e) => {
//                           console.error('Image failed to load:', imageUrl)

//                           const originalSrc = e.target.src
//                           const backendUrl = API_BASE_URL

//                           const urlVariations = [
//                             `${backendUrl}/storage/${image.img_url?.replace(/^(\/storage\/|storage\/)/, '')}`,
//                             `${backendUrl}${image.img_url}`,
//                             `${backendUrl}/storage/property-images/${image.img_url?.split('/').pop()}`
//                           ]

//                           const nextUrl = urlVariations.find(url => url !== originalSrc)

//                           if (nextUrl) {
//                             console.log('Trying alternative URL:', nextUrl)
//                             e.target.src = nextUrl
//                           } else {
//                             console.log('All URL attempts failed, showing placeholder')
//                             e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f3f4f6"/><text x="200" y="100" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image Not Found</text></svg>'
//                           }
//                         }}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
//                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200/50">
//                         Image {index + 1}
//                       </div>
//                       {isDeleting && (
//                         <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
//                           <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium shadow-lg border border-red-400/50">
//                             <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
//                             Deleting...
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Current Image Info */}
//                     <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 shadow-sm">
//                       <div className="flex items-center gap-3">
//                         <div className="bg-green-100/80 backdrop-blur-sm p-2 rounded-lg border border-green-200/50">
//                           <FileImage className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-slate-800 truncate max-w-48">
//                             {image.filename || `Property Image ${index + 1}`}
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             Current image • ID: {image.id}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {/* Delete Button */}
//                         <button
//                           onClick={() => handleDeleteImage(image.id)}
//                           disabled={disabled || isDeleting}
//                           type="button"
//                           className="bg-red-100/80 hover:bg-red-200/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group/delete disabled:opacity-50 disabled:cursor-not-allowed border border-red-200/50 hover:border-red-300/50"
//                           title="Delete image"
//                         >
//                           {isDeleting ? (
//                             <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
//                           ) : (
//                             <Trash2 className="w-4 h-4 text-red-600 group-hover/delete:text-red-700 transition-colors" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}

//         {/* New Image Selection Area */}
//         <div
//           onClick={handleClick}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           className={`
//             relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-sm
//             ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
//             ${isDragOver && !disabled
//               ? 'border-blue-400/80 bg-blue-50/80 scale-[1.02] shadow-lg'
//               : selectedFile
//                 ? 'border-green-400/80 bg-green-50/80 shadow-md'
//                 : 'border-slate-300/80 bg-white/50 hover:border-blue-400/60 hover:bg-blue-50/60 hover:shadow-md'
//             }
//           `}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleInputChange}
//             disabled={disabled}
//             className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
//           />

//           {!selectedFile ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center">
//               {/* Upload Icon with Animation */}
//               <div className="relative mb-4">
//                 <div className={`p-4 rounded-full transition-all duration-300 backdrop-blur-sm border shadow-sm ${
//                   disabled
//                     ? 'bg-slate-200/80 border-slate-300/50'
//                     : 'bg-blue-100/80 group-hover:bg-blue-200/80 border-blue-200/50 group-hover:border-blue-300/50'
//                 }`}>
//                   <Upload className={`w-8 h-8 transition-all duration-300 ${
//                     disabled ? 'text-slate-400' : `text-blue-600 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`
//                   }`} />
//                 </div>
//                 {isDragOver && !disabled && (
//                   <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
//                 )}
//               </div>

//               {/* Upload Text */}
//               <div className="space-y-2">
//                 <h4 className={`text-lg font-semibold transition-colors ${
//                   disabled ? 'text-slate-400' :
//                   isDragOver ? 'text-blue-700' :
//                   editMode ? 'text-slate-600 group-hover:text-blue-700' :
//                   'text-slate-700 group-hover:text-blue-700'
//                 }`}>
//                   {isDragOver && !disabled ? 'Drop your image here' :
//                    editMode ? 'Add Another Image' :
//                    'Upload Property Image'}
//                 </h4>
//                 <p className="text-sm text-slate-500">
//                   {disabled ? 'Image upload disabled' : 'Drag & drop or click to select'}
//                 </p>
//                 <p className="text-xs text-slate-400">
//                   Supports JPG, PNG, WebP (Max 10MB)
//                 </p>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
//                 <Sparkles size={20} className={disabled ? "text-slate-400" : "text-blue-500"} />
//               </div>
//             </div>
//           ) : (
//             <div className="p-4">
//               {/* New Image Preview */}
//               {imagePreview && (
//                 <div className="mb-4 relative group">
//                   <img
//                     src={imagePreview}
//                     alt="New image preview"
//                     className="w-full h-32 object-cover rounded-xl border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
//                   <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-amber-800 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200/50">
//                     New Image
//                   </div>
//                 </div>
//               )}

//               {/* New File Info */}
//               <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-yellow-100/80 backdrop-blur-sm p-2 rounded-lg border border-yellow-200/50">
//                     <FileImage className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-800 truncate max-w-48">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {!editMode && (
//                     <div className="bg-green-100/80 backdrop-blur-sm p-2 rounded-full border border-green-200/50">
//                       <CheckCircle className="w-4 h-4 text-green-600" />
//                     </div>
//                   )}

//                   {/* Remove Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleRemove()
//                     }}
//                     disabled={isUploading}
//                     type="button"
//                     className="bg-red-100/80 hover:bg-red-200/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group/remove disabled:opacity-50 disabled:cursor-not-allowed border border-red-200/50 hover:border-red-300/50"
//                     title="Remove image"
//                   >
//                     <X className="w-4 h-4 text-red-600 group-hover/remove:text-red-700 transition-colors" />
//                   </button>
//                 </div>
//               </div>

//               {/* Upload Instructions */}
//               <div className="mt-3 text-center">
//                 <span className="text-xs text-slate-500">
//                   {editMode ?
//                     'Click "Save Changes" to upload this image along with property updates' :
//                     'Image ready for upload'
//                   }
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Drag Overlay */}
//           {isDragOver && !disabled && (
//             <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center border-2 border-blue-400/80 rounded-2xl">
//               <div className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium shadow-lg border border-blue-400/50">
//                 <Upload className="w-5 h-5 inline mr-2" />
//                 Drop to upload
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
