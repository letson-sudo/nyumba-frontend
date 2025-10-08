// works with editing form data
'use client'

// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import axios from 'axios'
// import AddPropertyForm from '@/components/forms/property/AddPropertyForm'

// // Configure axios defaults
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['Content-Type'] = 'application/json'

// // Debug configuration - set to false in production
// const DEBUG_MODE = process.env.NODE_ENV === 'development'

// // Enhanced debug logger
// const debugLog = {
//   info: (message, data = null) => {
//     if (DEBUG_MODE) {
//       console.log(`🔍 [EditProperty] ${message}`, data || '')
//     }
//   },
//   error: (message, error = null) => {
//     if (DEBUG_MODE) {
//       console.error(`❌ [EditProperty] ${message}`, error || '')
//     }
//   },
//   success: (message, data = null) => {
//     if (DEBUG_MODE) {
//       console.log(`✅ [EditProperty] ${message}`, data || '')
//     }
//   },
//   warn: (message, data = null) => {
//     if (DEBUG_MODE) {
//       console.warn(`⚠️ [EditProperty] ${message}`, data || '')
//     }
//   }
// }

// export default function EditPropertyPage() {
//   const { id } = useParams()
//   const router = useRouter()
//   const [property, setProperty] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [debugInfo, setDebugInfo] = useState({})

//   useEffect(() => {
//     debugLog.info('Component mounted', { id, timestamp: new Date().toISOString() })

//     if (id) {
//       debugLog.info('Property ID found, starting fetch', { id })
//       fetchProperty()
//     } else {
//       debugLog.error('No property ID provided in URL params')
//       setError('No property ID provided')
//       setLoading(false)
//     }
//   }, [id])

//   const fetchProperty = async () => {
//     const startTime = Date.now()
//     debugLog.info('Starting fetchProperty function', {
//       propertyId: id,
//       timestamp: new Date().toISOString(),
//       url: `http://localhost:8000/api/properties/edit/${id}`
//     })

//     try {
//       setLoading(true)
//       setError(null)

//       // Log request details
//       debugLog.info('Making API request', {
//         method: 'GET',
//         url: `http://localhost:8000/api/properties/edit/${id}`,
//         headers: axios.defaults.headers.common,
//         withCredentials: axios.defaults.withCredentials
//       })

//       // FIXED: Use the correct API endpoint
//       const res = await axios.get(`http://localhost:8000/api/properties/edit/${id}`)
//       const requestDuration = Date.now() - startTime

//       debugLog.success('API request completed', {
//         status: res.status,
//         statusText: res.statusText,
//         duration: `${requestDuration}ms`,
//         headers: res.headers,
//         data: res.data
//       })

//       // Handle different response formats from your backend
//       let propertyData = null
//       let responseType = 'unknown'

//       if (res.data && res.data.success && res.data.property) {
//         propertyData = res.data.property
//         responseType = 'success_with_property'
//         debugLog.info('Response format: success with property wrapper', propertyData)
//       } else if (res.data && res.data.property) {
//         propertyData = res.data.property
//         responseType = 'property_only'
//         debugLog.info('Response format: property without success flag', propertyData)
//       } else if (res.data && !res.data.property && !res.data.success) {
//         // Direct property object response
//         propertyData = res.data
//         responseType = 'direct_property'
//         debugLog.info('Response format: direct property object', propertyData)
//       } else {
//         responseType = 'invalid'
//         debugLog.error('Invalid response format detected', {
//           hasData: !!res.data,
//           hasSuccess: !!res.data?.success,
//           hasProperty: !!res.data?.property,
//           dataKeys: res.data ? Object.keys(res.data) : null,
//           rawData: res.data
//         })
//         throw new Error('Property not found or invalid response format')
//       }

//       // Validate property data
//       debugLog.info('Validating property data', { propertyData, responseType })

//       if (!propertyData) {
//         debugLog.error('Property data is null or undefined')
//         throw new Error('No property data received from server')
//       }

//       if (!propertyData.id) {
//         debugLog.error('Property data missing required ID field', propertyData)
//         throw new Error('Invalid property data: missing ID field')
//       }

//       // Log successful property validation
//       debugLog.success('Property data validation successful', {
//         propertyId: propertyData.id,
//         title: propertyData.title,
//         location: propertyData.location,
//         price: propertyData.price,
//         status: propertyData.status,
//         allFields: Object.keys(propertyData)
//       })

//       setProperty(propertyData)

//       // Store debug info for UI display
//       if (DEBUG_MODE) {
//         setDebugInfo({
//           requestDuration,
//           responseType,
//           dataReceived: new Date().toISOString(),
//           propertyFields: Object.keys(propertyData),
//           apiStatus: res.status
//         })
//       }

//     } catch (err) {
//       const requestDuration = Date.now() - startTime

//       debugLog.error('Failed to fetch property', {
//         error: err.message,
//         duration: `${requestDuration}ms`,
//         stack: err.stack,
//         response: err.response?.data,
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         headers: err.response?.headers
//       })

//       let errorMessage = 'Failed to load property'
//       let errorCode = 'UNKNOWN_ERROR'

//       if (err.response?.status === 404) {
//         errorMessage = 'Property not found'
//         errorCode = 'NOT_FOUND_404'
//         debugLog.error('Property not found (404)', { propertyId: id })
//       } else if (err.response?.status === 403) {
//         errorMessage = 'You do not have permission to edit this property'
//         errorCode = 'FORBIDDEN_403'
//         debugLog.error('Access forbidden (403)', { propertyId: id })
//       } else if (err.response?.status === 401) {
//         errorMessage = 'Please log in to continue'
//         errorCode = 'UNAUTHORIZED_401'
//         debugLog.error('Unauthorized access (401)', { propertyId: id })
//       } else if (err.response?.status === 500) {
//         errorMessage = 'Server error occurred'
//         errorCode = 'SERVER_ERROR_500'
//         debugLog.error('Server error (500)', { propertyId: id, serverResponse: err.response.data })
//       } else if (err.code === 'ERR_NETWORK') {
//         errorMessage = 'Network error - unable to connect to server'
//         errorCode = 'NETWORK_ERROR'
//         debugLog.error('Network error', { propertyId: id })
//       } else if (err.code === 'ECONNREFUSED') {
//         errorMessage = 'Connection refused - server may be down'
//         errorCode = 'CONNECTION_REFUSED'
//         debugLog.error('Connection refused', { propertyId: id })
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message
//         errorCode = 'SERVER_MESSAGE'
//         debugLog.error('Server provided error message', { message: errorMessage })
//       } else if (err.message) {
//         errorMessage = err.message
//         errorCode = 'CLIENT_ERROR'
//         debugLog.error('Client-side error', { message: errorMessage })
//       }

//       setError(errorMessage)

//       // Store debug info for error state
//       if (DEBUG_MODE) {
//         setDebugInfo({
//           requestDuration,
//           errorCode,
//           errorTime: new Date().toISOString(),
//           httpStatus: err.response?.status,
//           networkError: err.code,
//           serverMessage: err.response?.data?.message
//         })
//       }

//     } finally {
//       setLoading(false)
//       debugLog.info('fetchProperty completed', {
//         duration: `${Date.now() - startTime}ms`,
//         timestamp: new Date().toISOString()
//       })
//     }
//   }

//   const handlePropertyUpdated = (updatedProperty) => {
//     debugLog.success('Property updated successfully', {
//       propertyId: updatedProperty?.id,
//       updatedData: updatedProperty,
//       timestamp: new Date().toISOString()
//     })

//     // Navigate back to the properties list after successful update
//     router.push('/dashboard') // Adjust this path to match your properties list route
//   }

//   const handleCancel = () => {
//     debugLog.info('User cancelled edit operation', { propertyId: id })
//     // Navigate back to previous page or dashboard
//     router.back()
//   }

//   // Debug component for development
//   const DebugPanel = () => {
//     if (!DEBUG_MODE || (!debugInfo && !error && !property)) return null

//     return (
//       <div className="mb-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs">
//         <h3 className="text-yellow-400 font-bold mb-2">🐛 Debug Information</h3>
//         <div className="space-y-1">
//           <div>Property ID: <span className="text-white">{id}</span></div>
//           <div>Timestamp: <span className="text-white">{new Date().toISOString()}</span></div>
//           {debugInfo.requestDuration && (
//             <div>Request Duration: <span className="text-white">{debugInfo.requestDuration}ms</span></div>
//           )}
//           {debugInfo.responseType && (
//             <div>Response Type: <span className="text-white">{debugInfo.responseType}</span></div>
//           )}
//           {debugInfo.apiStatus && (
//             <div>API Status: <span className="text-white">{debugInfo.apiStatus}</span></div>
//           )}
//           {debugInfo.errorCode && (
//             <div>Error Code: <span className="text-red-400">{debugInfo.errorCode}</span></div>
//           )}
//           {debugInfo.propertyFields && (
//             <div>Property Fields: <span className="text-white">{debugInfo.propertyFields.join(', ')}</span></div>
//           )}
//           {property && (
//             <div>Property Loaded: <span className="text-green-400">✓ {property.title || 'Untitled'}</span></div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Loading state
//   if (loading) {
//     debugLog.info('Rendering loading state')
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
//           <div className="animate-pulse space-y-4">
//             <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
//             <div className="space-y-3">
//               <div className="h-4 bg-gray-200 rounded"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           </div>
//           <p className="text-center text-gray-600 mt-4">Loading property data...</p>
//           {DEBUG_MODE && (
//             <p className="text-center text-xs text-gray-400 mt-2">
//               Debug: Fetching property ID {id}
//             </p>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Error state
//   if (error) {
//     debugLog.warn('Rendering error state', { error })
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
//           <DebugPanel />
//           <div className="text-red-600 mb-4">
//             <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Property</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="flex gap-3">
//             <button
//               onClick={handleCancel}
//               className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
//             >
//               Go Back
//             </button>
//             <button
//               onClick={fetchProperty}
//               className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Property not found state
//   if (!property) {
//     debugLog.warn('Rendering property not found state')
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
//           <DebugPanel />
//           <div className="text-gray-400 mb-4">
//             <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
//           <p className="text-gray-600 mb-6">The property you're trying to edit could not be found.</p>
//           <button
//             onClick={handleCancel}
//             className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Main edit form
//   debugLog.info('Rendering main edit form', { propertyTitle: property.title })
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <DebugPanel />

//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Edit Property</h1>
//                 <p className="text-blue-100 mt-1">
//                   Update property information
//                   {property.title && (
//                     <span className="block text-sm opacity-90 mt-1">
//                       Editing: {property.title}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button
//                 onClick={handleCancel}
//                 className="text-blue-100 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 title="Cancel and go back"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Property Form */}
//         <AddPropertyForm
//           editMode={true}
//           initialData={property}
//           onPropertyAdded={handlePropertyUpdated}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import AddPropertyForm from '@/components/forms/property/AddPropertyForm'

// Configure axios defaults
axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Debug configuration - set to false in production
const DEBUG_MODE = process.env.NODE_ENV === 'development'

// Enhanced debug logger
const debugLog = {
  info: (message, data = null) => {
    if (DEBUG_MODE) {
      console.log(`🔍 [EditProperty] ${message}`, data || '')
    }
  },
  error: (message, error = null) => {
    if (DEBUG_MODE) {
      console.error(`❌ [EditProperty] ${message}`, error || '')
    }
  },
  success: (message, data = null) => {
    if (DEBUG_MODE) {
      console.log(`✅ [EditProperty] ${message}`, data || '')
    }
  },
  warn: (message, data = null) => {
    if (DEBUG_MODE) {
      console.warn(`⚠️ [EditProperty] ${message}`, data || '')
    }
  }
}

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    debugLog.info('Component mounted', { id, timestamp: new Date().toISOString() })

    if (id) {
      debugLog.info('Property ID found, starting fetch', { id })
      fetchPropertyAndImages()
    } else {
      debugLog.error('No property ID provided in URL params')
      setError('No property ID provided')
      setLoading(false)
    }
  }, [id])

  const fetchPropertyAndImages = async () => {
    const startTime = Date.now()
    debugLog.info('Starting fetchPropertyAndImages function', {
      propertyId: id,
      timestamp: new Date().toISOString()
    })

    try {
      setLoading(true)
      setError(null)

      // Fetch property and images in parallel
      const [propertyResponse, imagesResponse] = await Promise.allSettled([
        fetchProperty(),
        fetchExistingImages()
      ])

      // Handle property response
      if (propertyResponse.status === 'fulfilled') {
        debugLog.success('Property fetch completed successfully')
      } else {
        debugLog.error('Property fetch failed', propertyResponse.reason)
        throw propertyResponse.reason
      }

      // Handle images response (don't fail if images fetch fails)
      if (imagesResponse.status === 'fulfilled') {
        debugLog.success('Images fetch completed successfully')
      } else {
        debugLog.warn('Images fetch failed, but continuing', imagesResponse.reason)
        // Set empty images array if fetch fails
        setImages([])
      }

      const requestDuration = Date.now() - startTime
      debugLog.success('fetchPropertyAndImages completed', {
        duration: `${requestDuration}ms`,
        propertyLoaded: !!property,
        imagesCount: images.length
      })

    } catch (err) {
      debugLog.error('fetchPropertyAndImages failed', err)
      // Error handling is done in individual fetch functions
    } finally {
      setLoading(false)
    }
  }

  const fetchProperty = async () => {
    const startTime = Date.now()
    debugLog.info('Starting fetchProperty function', {
      propertyId: id,
      url: `http://localhost:8000/api/properties/edit/${id}`
    })

    try {
      const res = await axios.get(`http://localhost:8000/api/properties/edit/${id}`)
      const requestDuration = Date.now() - startTime

      debugLog.success('Property API request completed', {
        status: res.status,
        statusText: res.statusText,
        duration: `${requestDuration}ms`,
        data: res.data
      })

      // Handle different response formats from your backend
      let propertyData = null
      let responseType = 'unknown'

      if (res.data && res.data.success && res.data.property) {
        propertyData = res.data.property
        responseType = 'success_with_property'
        debugLog.info('Response format: success with property wrapper', propertyData)
      } else if (res.data && res.data.property) {
        propertyData = res.data.property
        responseType = 'property_only'
        debugLog.info('Response format: property without success flag', propertyData)
      } else if (res.data && !res.data.property && !res.data.success) {
        // Direct property object response
        propertyData = res.data
        responseType = 'direct_property'
        debugLog.info('Response format: direct property object', propertyData)
      } else {
        responseType = 'invalid'
        debugLog.error('Invalid response format detected', {
          hasData: !!res.data,
          hasSuccess: !!res.data?.success,
          hasProperty: !!res.data?.property,
          dataKeys: res.data ? Object.keys(res.data) : null,
          rawData: res.data
        })
        throw new Error('Property not found or invalid response format')
      }

      // Validate property data
      if (!propertyData || !propertyData.id) {
        debugLog.error('Invalid property data', propertyData)
        throw new Error('Invalid property data: missing ID field')
      }

      debugLog.success('Property data validation successful', {
        propertyId: propertyData.id,
        title: propertyData.title,
        location: propertyData.location,
        price: propertyData.price
      })

      setProperty(propertyData)

      // Store debug info
      if (DEBUG_MODE) {
        setDebugInfo(prev => ({
          ...prev,
          propertyRequestDuration: requestDuration,
          responseType,
          apiStatus: res.status
        }))
      }

      return propertyData

    } catch (err) {
      const requestDuration = Date.now() - startTime
      debugLog.error('Failed to fetch property', {
        error: err.message,
        duration: `${requestDuration}ms`,
        response: err.response?.data,
        status: err.response?.status
      })

      let errorMessage = 'Failed to load property'

      if (err.response?.status === 404) {
        errorMessage = 'Property not found'
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to edit this property'
      } else if (err.response?.status === 401) {
        errorMessage = 'Please log in to continue'
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred'
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - unable to connect to server'
      }

      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const fetchExistingImages = async () => {
    if (!id) return []

    const startTime = Date.now()
    debugLog.info('📸 Starting fetchExistingImages function', {
      propertyId: id,
      url: `http://localhost:8000/api/properties/${id}/images`
    })

    try {
      // Try multiple possible API endpoints for images
      const possibleEndpoints = [
        `/api/properties/${id}/images`,
        `/api/properties/${id}/image`,
        `/api/property-images/${id}`,
        `/api/images/property/${id}`
      ]

      let response = null
      let usedEndpoint = null

      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          debugLog.info('📸 Trying endpoint', { endpoint })
          response = await axios.get(`http://localhost:8000${endpoint}`)
          usedEndpoint = endpoint
          debugLog.success('📸 Endpoint successful', { endpoint })
          break
        } catch (endpointError) {
          debugLog.warn('📸 Endpoint failed', {
            endpoint,
            status: endpointError.response?.status,
            message: endpointError.message
          })
          continue
        }
      }

      if (!response) {
        debugLog.warn('📸 All image endpoints failed, assuming no images exist')
        setImages([])
        return []
      }

      const requestDuration = Date.now() - startTime
      debugLog.success('📸 Images API request completed', {
        endpoint: usedEndpoint,
        status: response.status,
        duration: `${requestDuration}ms`,
        data: response.data
      })

      // Handle different response formats
      let imageData = []

      if (response.data && response.data.success && response.data.images) {
        imageData = response.data.images
        debugLog.success('📸 Images loaded (success wrapper format)', {
          count: imageData.length,
          images: imageData.map(img => ({ id: img.id, url: img.img_url }))
        })
      } else if (response.data && Array.isArray(response.data.images)) {
        imageData = response.data.images
        debugLog.success('📸 Images loaded (array format)', { count: imageData.length })
      } else if (response.data && Array.isArray(response.data)) {
        imageData = response.data
        debugLog.success('📸 Images loaded (direct array format)', { count: imageData.length })
      } else if (response.data && response.data.image_url) {
        // Single image format
        imageData = [{
          id: response.data.id || 1,
          img_url: response.data.image_url,
          filename: response.data.filename || 'Property Image'
        }]
        debugLog.success('📸 Single image loaded', imageData[0])
      } else {
        debugLog.warn('📸 Unexpected response format', response.data)
        imageData = []
      }

      setImages(imageData)
      return imageData

    } catch (err) {
      const requestDuration = Date.now() - startTime
      debugLog.error('📸 Failed to fetch existing images', {
        error: err.message,
        duration: `${requestDuration}ms`,
        response: err.response?.data,
        status: err.response?.status
      })

      // Don't fail for image fetch errors - just log and continue
      if (err.response?.status === 404) {
        debugLog.info('📸 No existing images (404) - this is normal')
      }

      setImages([])
      return []
    }
  }

  const handlePropertyUpdated = (updatedProperty) => {
    debugLog.success('Property updated successfully', {
      propertyId: updatedProperty?.id,
      updatedData: updatedProperty,
      timestamp: new Date().toISOString()
    })

    // Navigate back to the properties list after successful update
    router.push('/dashboard')
  }

  const handleCancel = () => {
    debugLog.info('User cancelled edit operation', { propertyId: id })
    router.back()
  }

  // Debug component for development
  const DebugPanel = () => {
    if (!DEBUG_MODE) return null

    return (
      <div className="mb-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs">
        <h3 className="text-yellow-400 font-bold mb-2">🐛 Debug Information</h3>
        <div className="space-y-1">
          <div>Property ID: <span className="text-white">{id}</span></div>
          <div>Timestamp: <span className="text-white">{new Date().toISOString()}</span></div>
          {debugInfo.propertyRequestDuration && (
            <div>Property Request: <span className="text-white">{debugInfo.propertyRequestDuration}ms</span></div>
          )}
          {debugInfo.responseType && (
            <div>Response Type: <span className="text-white">{debugInfo.responseType}</span></div>
          )}
          {debugInfo.apiStatus && (
            <div>API Status: <span className="text-white">{debugInfo.apiStatus}</span></div>
          )}
          {property && (
            <div>Property Loaded: <span className="text-green-400">✓ {property.title || 'Untitled'}</span></div>
          )}
          {images && (
            <div>Images Loaded: <span className="text-blue-400">📸 {images.length} images</span></div>
          )}
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading property data...</p>
          <p className="text-center text-blue-600 text-sm mt-2">📸 Loading images...</p>
          {DEBUG_MODE && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Debug: Fetching property ID {id}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
          <DebugPanel />
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Property</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go Back
            </button>
            <button
              onClick={fetchPropertyAndImages}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Property not found state
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4">
          <DebugPanel />
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're trying to edit could not be found.</p>
          <button
            onClick={handleCancel}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Main edit form
  debugLog.info('Rendering main edit form', {
    propertyTitle: property.title,
    imagesCount: images.length
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <DebugPanel />

      {/* Property Form */}
      <AddPropertyForm
        editMode={true}
        initialData={property}
        existingImages={images}
        onPropertyAdded={handlePropertyUpdated}
        onClose={handleCancel}
      />
    </div>
  )
}
