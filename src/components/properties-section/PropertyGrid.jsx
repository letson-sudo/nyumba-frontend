
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AddPropertyForm from '../forms/property/AddPropertyForm'
import PropertyCard from './PropertyCard'
import {
  Plus,
  Building2,
  AlertTriangle,
  Loader2,
  Home,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye
} from 'lucide-react'

// Configure axios defaults
axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export default function PropertyGrid() {
  const [showForm, setShowForm] = useState(false)
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllProperties, setShowAllProperties] = useState(false)

  // Get properties to display based on showAllProperties state and screen size
  const getDisplayLimit = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 3  // mobile: show 3
      if (window.innerWidth < 1024) return 4 // tablet: show 4
      return 6 // desktop: show 6
    }
    return 6 // default
  }

  const displayLimit = getDisplayLimit()
  const displayedProperties = showAllProperties ? properties : properties.slice(0, displayLimit)
  const hasMoreProperties = properties.length > displayLimit

  const router = useRouter()

  useEffect(() => {
    fetchProperties()
  }, [])

  // Handle window resize for responsive display limit
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window size changes to update display limit
      setShowAllProperties(prev => prev)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await axios.get('http://localhost:8000/api/properties/all')
      console.log('Properties API Response:', res.data)

      if (res.data && res.data.success && Array.isArray(res.data.properties)) {
        setProperties(res.data.properties)
      } else {
        setProperties([])
      }

    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setError(error.message)
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePropertyAdded = () => {
    setShowForm(false)
    fetchProperties()
  }

  const handleEdit = (propertyId) => {
    console.log('Navigating to:', `/editProperty/${propertyId}`)
    console.log('Property ID:', propertyId)
    router.push(`/editProperty/${propertyId}`)
  }

  const handleStatusUpdate = (propertyId, newStatus) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, status: newStatus }
          : property
      )
    )
  }

  return (
    <section className="mb-8 sm:mb-12">
      {/* Header - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Properties</h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-tight sm:leading-normal">
              Manage and track your real estate portfolio
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Add Property</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Add Property Form */}
      {showForm && (
        <AddPropertyForm
          onClose={() => setShowForm(false)}
          onPropertyAdded={handlePropertyAdded}
        />
      )}

      {/* Properties Grid - responsive grid layout */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {isLoading ? (
          // Loading skeleton - responsive count
          [...Array(displayLimit)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
                    <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="w-12 sm:w-16 h-5 sm:h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-12 sm:h-16 bg-gray-200 rounded-xl mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                <div className="flex flex-col xs:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex-1 h-8 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                  <div className="flex-1 h-8 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state - responsive layout
          <div className="col-span-full text-center py-8 sm:py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
              <div className="bg-red-100 p-2.5 sm:p-3 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-2">
                Failed to Load Properties
              </h3>
              <p className="text-red-700 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchProperties}
                className="flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-red-700 transition-colors mx-auto text-sm"
              >
                <RefreshCw size={14} className="sm:w-4 sm:h-4" />
                Try Again
              </button>
            </div>
          </div>
        ) : properties.length === 0 ? (
          // Empty state - responsive layout
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-lg mx-auto">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6">
                <Home className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                No Properties Yet
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
                Start building your real estate portfolio by adding your first property.
                Track rentals, manage tenants, and grow your investment.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 active:scale-95 mx-auto text-sm sm:text-base"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                Add Your First Property
              </button>
            </div>
          </div>
        ) : (
          // Properties list
          displayedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>

      {/* Show All/Show Less Button - responsive */}
      {!isLoading && !error && hasMoreProperties && (
        <div className="flex justify-center mt-6 sm:mt-10">
          <button
            onClick={() => setShowAllProperties(!showAllProperties)}
            className="flex items-center gap-2 sm:gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md text-sm sm:text-base"
          >
            {showAllProperties ? (
              <>
                <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Show Less Properties</span>
                <span className="sm:hidden">Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">View All Properties ({properties.length})</span>
                <span className="sm:hidden">View All ({properties.length})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Properties count indicator - responsive */}
      {!isLoading && !error && properties.length > 0 && (
        <div className="text-center mt-4 sm:mt-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-100 text-gray-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
            <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">
              Showing {displayedProperties.length} of {properties.length} properties
            </span>
            <span className="sm:hidden">
              {displayedProperties.length}/{properties.length}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
