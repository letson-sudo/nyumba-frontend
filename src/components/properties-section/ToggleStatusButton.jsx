
import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Loader2 } from 'lucide-react'
import axios from '@/lib/axios'

export default function ToggleStatusButton({
  property,
  onStatusUpdate,
  onStatusFetched, // New prop to pass status back to parent
  size = 'default',
  fullWidth = false
}) {
  const [isToggling, setIsToggling] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(null)
  const [errors, setErrors] = useState({})

  // Fetch current property status on component mount
  useEffect(() => {
    fetchCurrentStatus()
  }, [property.id])

  const fetchCurrentStatus = async () => {
    setIsFetching(true)
    setErrors({})

    try {
      console.log('🔍 Fetching current status for property ID:', property.id)

      const response = await axios.get('/api/status/booked', {
        withCredentials: true,
      })

      console.log('📥 Booked units response:', response.data)

      if (response.data?.success) {
        // Find the current property in the booked units list
        const bookedProperties = response.data.data?.properties || []
        const foundProperty = bookedProperties.find(p =>
          p.property_id === property.id || p.property?.id === property.id
        )

        const status = foundProperty ? 'booked' : 'vacant'
        setCurrentStatus(status)

        // Pass status back to parent component
        onStatusFetched?.(status)

        console.log('✅ Status determined:', status)
      } else {
        throw new Error(response.data?.message || 'Failed to fetch property status')
      }

    } catch (error) {
      console.error('❌ Failed to fetch current status:', error)

      // Fallback to property.status or default to vacant
      const fallbackStatus = property.status || 'vacant'
      setCurrentStatus(fallbackStatus)
      onStatusFetched?.(fallbackStatus)

      if (error.response?.status === 401) {
        setErrors({ general: ['Please log in to view property status.'] })
      } else if (error.response?.status === 419) {
        setErrors({ general: ['Session expired. Please refresh the page.'] })
      } else {
        setErrors({ general: ['Could not fetch current status. Using fallback.'] })
      }

      console.log('🔄 Using fallback status:', fallbackStatus)
    } finally {
      setIsFetching(false)
    }
  }

  // Use fetched status
  const status = currentStatus

  const handleToggleStatus = async () => {
    setIsToggling(true)
    setErrors({})

    // Determine what the NEW status should be
    const newStatus = status === 'vacant' ? 'booked' : 'vacant'

    const requestData = {
      property_id: property.id,
      status: newStatus
    }

    console.log('🏠 Property:', property)
    console.log('📊 Current status:', status)
    console.log('🔄 New status to send:', newStatus)
    console.log('📤 Sending to backend:', requestData)

    try {
      const response = await axios.post('/api/status/update', requestData, {
        withCredentials: true,
      })

      console.log('📥 Response from backend:', response.status, response.data)

      // Handle successful response
      if (response.data?.success || response.status === 200) {
        // ✅ Update local state and parent component
        setCurrentStatus(newStatus)
        onStatusUpdate?.(property.id, newStatus)
        onStatusFetched?.(newStatus) // Also update parent's status display
        console.log('✅ Status updated successfully from', status, 'to', newStatus)
      } else {
        setErrors({ general: [response.data?.message || 'Failed to update status'] })
      }

    } catch (error) {
      console.error('❌ Status update failed:', error)

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else if (error.response?.status === 419) {
        setErrors({ general: ['Session expired. Please refresh the page and try again.'] })
      } else if (error.response?.status === 401) {
        setErrors({ general: ['Please log in to update property status.'] })
      } else if (error.response) {
        setErrors({
          general: [error.response.data?.message || `Server error: ${error.response.status}`]
        })
      } else if (error.request) {
        setErrors({ general: ['Network error. Please check your connection and try again.'] })
      } else {
        setErrors({ general: ['An unexpected error occurred. Please try again.'] })
      }

      const errorMessage = errors.general?.[0] || 'Failed to update status. Please try again.'
      alert(errorMessage)

    } finally {
      setIsToggling(false)
    }
  }

  const getToggleButtonConfig = () => {
    // 🔑 KEY FIX: Button shows what ACTION it will perform
    if (status === 'vacant') {
      // Current status is vacant, so button should say "Mark as Booked"
      return {
        text: 'Mark as Booked',
        textMobile: 'Book',
        shortText: 'Book',
        icon: Clock,
        colors: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
        loadingText: 'Booking...',
        loadingTextMobile: 'Booking...'
      }
    } else if (status === 'booked') {
      // Current status is booked, so button should say "Mark as Vacant"
      return {
        text: 'Mark as Vacant',
        textMobile: 'Vacant',
        shortText: 'Vacant',
        icon: CheckCircle,
        colors: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300',
        loadingText: 'Making Vacant...',
        loadingTextMobile: 'Updating...'
      }
    } else {
      // For other statuses (maintenance, unavailable), default to making vacant
      return {
        text: 'Mark as Vacant',
        textMobile: 'Vacant',
        shortText: 'Vacant',
        icon: CheckCircle,
        colors: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300',
        loadingText: 'Making Vacant...',
        loadingTextMobile: 'Updating...'
      }
    }
  }

  const toggleConfig = getToggleButtonConfig()
  const ToggleIcon = toggleConfig.icon

  // Responsive size configurations
  const sizeClasses = {
    small: {
      button: 'px-2 py-1.5 text-xs',
      buttonMobile: 'px-2 py-1.5 text-xs',
      icon: 12,
      iconMobile: 10,
      gap: 'gap-1',
      gapMobile: 'gap-0.5'
    },
    default: {
      button: 'px-3 py-2 text-sm',
      buttonMobile: 'px-2.5 py-1.5 text-xs',
      icon: 14,
      iconMobile: 12,
      gap: 'gap-1.5',
      gapMobile: 'gap-1'
    },
    large: {
      button: 'px-4 py-3 text-base',
      buttonMobile: 'px-3 py-2 text-sm',
      icon: 16,
      iconMobile: 14,
      gap: 'gap-2',
      gapMobile: 'gap-1.5'
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.default
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <div className={widthClass}>
      <button
        onClick={handleToggleStatus}
        disabled={isToggling || isFetching}
        className={`
          w-full flex items-center justify-center
          ${currentSize.gapMobile} ${currentSize.buttonMobile}
          sm:${currentSize.gap} sm:${currentSize.button}
          ${toggleConfig.colors}
          border rounded-lg font-medium
          transition-all duration-200 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title={isToggling ? toggleConfig.loadingText : toggleConfig.text}
      >
        {/* Icon - responsive sizing */}
        {isToggling || isFetching ? (
          <>
            <Loader2
              size={currentSize.iconMobile}
              className="animate-spin sm:hidden flex-shrink-0"
            />
            <Loader2
              size={currentSize.icon}
              className="animate-spin hidden sm:block flex-shrink-0"
            />
          </>
        ) : (
          <>
            <ToggleIcon
              size={currentSize.iconMobile}
              className="sm:hidden flex-shrink-0"
            />
            <ToggleIcon
              size={currentSize.icon}
              className="hidden sm:block flex-shrink-0"
            />
          </>
        )}

        {/* Text - responsive display and content */}
        {isToggling || isFetching ? (
          <>
            {/* Mobile loading text */}
            <span className="sm:hidden truncate">
              {isFetching ? 'Loading...' : toggleConfig.loadingTextMobile}
            </span>

            {/* Desktop loading text */}
            <span className="hidden sm:inline truncate">
              {isFetching ? 'Loading...' : toggleConfig.loadingText}
            </span>
          </>
        ) : (
          <>
            {/* Mobile button text - shorter versions */}
            <span className="sm:hidden truncate">
              {size === 'small' ? toggleConfig.shortText : toggleConfig.textMobile}
            </span>

            {/* Desktop button text - full versions */}
            <span className="hidden sm:inline truncate">
              {size === 'large' ? toggleConfig.text :
               size === 'small' ? toggleConfig.shortText : toggleConfig.text}
            </span>
          </>
        )}
      </button>

      {/* Error Display - responsive */}
      {errors.general && (
        <div className="mt-1.5 sm:mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 leading-tight">
          <span className="break-words">
            {errors.general[0]}
          </span>
        </div>
      )}

      {/* Debug Info (remove in production) - responsive */}
      <div className="mt-1 text-xs text-gray-500 hidden">
        {/* Status: {status || 'loading...'} */}
      </div>
    </div>
  )
}
