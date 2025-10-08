// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import AddPropertyForm from './AddPropertyForm'
// import {
//   Plus,
//   Building2,
//   MapPin,
//   DollarSign,
//   Edit3,
//   Trash2,
//   Eye,
//   AlertTriangle,
//   Loader2,
//   Home,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   CheckCircle,
//   Clock,
//   Wrench,
//   XCircle,
//   Sparkles
// } from 'lucide-react'

// // Configure axios defaults
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['Content-Type'] = 'application/json'

// // Confirmation Modal Component
// function DeleteConfirmationModal({ isOpen, onClose, onConfirm, propertyTitle, isDeleting }) {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0   flex items-center justify-center z-50 p-2">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100 animate-in fade-in-0 zoom-in-95 duration-300">
//         <div className="p-8 text-center">
//           {/* Icon */}
//           <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full">
//             <div className="bg-red-500 p-3 rounded-full">
//               <AlertTriangle className="w-8 h-8 text-white" />
//             </div>
//           </div>

//           {/* Title */}
//           <h3 className="text-2xl font-bold text-gray-900 mb-3">
//             Delete Property?
//           </h3>

//           {/* Message */}
//           <p className="text-gray-600 mb-2 leading-relaxed">
//             Are you sure you want to permanently delete
//           </p>
//           <p className="font-semibold text-gray-900 mb-6 bg-gray-50 px-4 py-2 rounded-lg">
//             "{propertyTitle}"
//           </p>
//           <p className="text-sm text-red-600 mb-8">
//             This action cannot be undone and all data will be lost.
//           </p>

//           {/* Buttons */}
//           <div className="flex gap-4">
//             <button
//               onClick={onClose}
//               disabled={isDeleting}
//               className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={isDeleting}
//               className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 <>
//                   <Trash2 className="w-4 h-4" />
//                   Delete Property
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Status Badge Component
// function StatusBadge({ status }) {
//   const statusConfig = {
//     vacant: {
//       icon: CheckCircle,
//       color: 'bg-green-100 text-green-700 border-green-200',
//       label: 'Available'
//     },
//     booked: {
//       icon: Clock,
//       color: 'bg-blue-100 text-blue-700 border-blue-200',
//       label: 'Occupied'
//     },
//     maintenance: {
//       icon: Wrench,
//       color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       label: 'Maintenance'
//     },
//     unavailable: {
//       icon: XCircle,
//       color: 'bg-red-100 text-red-700 border-red-200',
//       label: 'Unavailable'
//     }
//   }

//   const config = statusConfig[status] || statusConfig.vacant
//   const Icon = config.icon

//   return (
//     <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
//       <Icon size={12} />
//       {config.label}
//     </div>
//   )
// }

// // Property Card Component
// function PropertyCard({ property, onEdit, onDelete }) {
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-MW', {
//       style: 'currency',
//       currency: 'MWK',
//       minimumFractionDigits: 0
//     }).format(price)
//   }

//   return (
//     <div className="group bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
//             {property.title}
//           </h3>
//           <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
//             <MapPin size={12} />
//             <span className="line-clamp-1">{property.location}</span>
//           </div>
//         </div>
//         <StatusBadge status={property.status || 'vacant'} />
//       </div>

//       {/* Price */}
//       <div className="mb-4">
//         <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
//           <DollarSign className="w-5 h-5 text-green-600" />
//           <div>
//             <p className="text-xl font-bold text-green-700">
//               {formatPrice(property.price)}
//             </p>
//             <p className="text-xs text-green-600">per month</p>
//           </div>
//         </div>
//       </div>

//       {/* Description */}
//       {property.description && (
//         <div className="mb-4">
//           <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//             {property.description}
//           </p>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
//         <button
//           onClick={() => onEdit(property.id)}
//           className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
//         >
//           <Edit3 size={14} />
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(property)}
//           className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
//         >
//           <Trash2 size={14} />
//           Delete
//         </button>
//       </div>

//       {/* Hover Effect Decoration */}
//       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
//         <Sparkles className="w-5 h-5 text-blue-500" />
//       </div>
//     </div>
//   )
// }

// export default function AddPropertySection() {
//   const [showForm, setShowForm] = useState(false)
//   const [properties, setProperties] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [showAllProperties, setShowAllProperties] = useState(false)
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, property: null })
//   const [isDeleting, setIsDeleting] = useState(false)

//   // Get properties to display based on showAllProperties state
//   const displayedProperties = showAllProperties ? properties : properties.slice(0, 6)
//   const hasMoreProperties = properties.length > 6

//   const router = useRouter()

//   useEffect(() => {
//     fetchProperties()
//   }, [])

//   const fetchProperties = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const res = await axios.get('http://localhost:8000/api/properties/all')

//       console.log('Properties API Response:', res.data)

//       // Handle the new response format: { success: true, properties: [...], total_count: 5 }
//       if (res.data && res.data.success && Array.isArray(res.data.properties)) {
//         setProperties(res.data.properties)
//       } else {
//         setProperties([])
//       }

//     } catch (error) {
//       console.error('Failed to fetch properties:', error)
//       setError(error.message)
//       setProperties([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePropertyAdded = () => {
//     setShowForm(false)
//     fetchProperties() // Refresh the list after adding a new property
//   }

//   const handleEdit = (propertyId) => {
//     console.log('Navigating to:', `/editProperty/${propertyId}`)
//     console.log('Property ID:', propertyId)
//     router.push(`/editProperty/${propertyId}`)
//   }

//   const handleDelete = (property) => {
//     setDeleteModal({ isOpen: true, property })
//   }

//   const confirmDelete = async () => {
//     const property = deleteModal.property
//     if (!property) return

//     setIsDeleting(true)
//     try {
//       const res = await axios.delete(`http://localhost:8000/api/properties/${property.id}`)

//       if (res.data && res.data.success) {
//         setDeleteModal({ isOpen: false, property: null })
//         fetchProperties() // Refresh the list
//         // Success feedback
//         console.log('Property deleted successfully!')
//       } else {
//         throw new Error(res.data?.error || 'Failed to delete property')
//       }
//     } catch (error) {
//       console.error('Failed to delete property:', error)
//       let errorMessage = 'Failed to delete property. Please try again.'

//       if (error.response?.status === 419) {
//         errorMessage = 'Authentication error. This usually means the API routes need CSRF configuration. Please check the Laravel backend setup.'
//       } else if (error.response?.status === 401) {
//         errorMessage = 'You are not authorized. Please login again.'
//       } else if (error.response?.status === 404) {
//         errorMessage = 'Property not found or already deleted.'
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message
//       }

//       alert(errorMessage)
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const closeDeleteModal = () => {
//     if (!isDeleting) {
//       setDeleteModal({ isOpen: false, property: null })
//     }
//   }

//   return (
//     <section className="mb-12">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-2xl">
//             <Building2 className="w-6 h-6 text-blue-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
//             <p className="text-gray-500 text-sm">Manage and track your real estate portfolio</p>
//           </div>
//         </div>
//         <button
//           onClick={() => setShowForm(true)}
//           className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 active:scale-95"
//         >
//           <Plus size={18} />
//           Add Property
//         </button>
//       </div>

//       {showForm && (
//         <AddPropertyForm
//           onClose={() => setShowForm(false)}
//           onPropertyAdded={handlePropertyAdded}
//         />
//       )}

//       {/* Properties Grid */}
//       <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {isLoading ? (
//           // Loading skeleton
//           [...Array(6)].map((_, index) => (
//             <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
//               <div className="animate-pulse">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
//                   <div className="flex-1">
//                     <div className="h-5 bg-gray-200 rounded mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//                   </div>
//                   <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
//                 </div>
//                 <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//                 <div className="flex gap-2 pt-4 border-t border-gray-100">
//                   <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
//                   <div className="h-10 w-20 bg-gray-200 rounded-xl"></div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : error ? (
//           // Error state
//           <div className="col-span-full text-center py-12">
//             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
//               <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
//                 <AlertTriangle className="w-8 h-8 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Properties</h3>
//               <p className="text-red-700 mb-4 text-sm">{error}</p>
//               <button
//                 onClick={fetchProperties}
//                 className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors mx-auto"
//               >
//                 <RefreshCw size={16} />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         ) : properties.length === 0 ? (
//           // Empty state
//           <div className="col-span-full text-center py-16">
//             <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 max-w-lg mx-auto">
//               <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
//                 <Home className="w-12 h-12 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">No Properties Yet</h3>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 Start building your real estate portfolio by adding your first property.
//                 Track rentals, manage tenants, and grow your investment.
//               </p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 active:scale-95 mx-auto"
//               >
//                 <Plus size={18} />
//                 Add Your First Property
//               </button>
//             </div>
//           </div>
//         ) : (
//           // Properties list
//           displayedProperties.map((property) => (
//             <PropertyCard
//               key={property.id}
//               property={property}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))
//         )}
//       </div>

//       {/* Show All/Show Less Button */}
//       {!isLoading && !error && hasMoreProperties && (
//         <div className="flex justify-center mt-10">
//           <button
//             onClick={() => setShowAllProperties(!showAllProperties)}
//             className="flex items-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
//           >
//             {showAllProperties ? (
//               <>
//                 <ChevronUp size={18} />
//                 Show Less Properties
//               </>
//             ) : (
//               <>
//                 <ChevronDown size={18} />
//                 View All Properties ({properties.length})
//               </>
//             )}
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={deleteModal.isOpen}
//         onClose={closeDeleteModal}
//         onConfirm={confirmDelete}
//         propertyTitle={deleteModal.property?.title || ''}
//         isDeleting={isDeleting}
//       />

//       {/* Properties count indicator */}
//       {!isLoading && !error && properties.length > 0 && (
//         <div className="text-center mt-6">
//           <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
//             <Eye size={14} />
//             Showing {displayedProperties.length} of {properties.length} properties
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }



import PropertyGrid from '../../properties-section/PropertyGrid'

export default function AddPropertySection() {
  return <PropertyGrid />
}
