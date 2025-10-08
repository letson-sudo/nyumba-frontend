
import { useState } from 'react'
import {
  MapPin,
  DollarSign,
  Sparkles,
  Loader2
} from 'lucide-react'
import StatusBadge from './StatusBadge'
import ToggleStatusButton from './ToggleStatusButton'
import EditButton from './EditButton'

export default function PropertyCard({ property, onEdit, onStatusUpdate }) {
  // Status will be set by ToggleStatusButton via onStatusFetched
  const [currentStatus, setCurrentStatus] = useState(property.status || 'vacant')
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Handle status fetched from ToggleStatusButton
  const handleStatusFetched = (status) => {
    console.log('📥 PropertyCard received status from ToggleStatusButton:', status)
    setCurrentStatus(status)
    setIsLoadingStatus(false)
  }

  // Handle status update from toggle button
  const handleStatusUpdate = (propertyId, newStatus) => {
    // Update local state immediately
    setCurrentStatus(newStatus)

    // Call parent's onStatusUpdate if provided
    onStatusUpdate?.(propertyId, newStatus)

    console.log('✅ PropertyCard status updated to:', newStatus)
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2 sm:line-clamp-1 leading-tight sm:leading-normal">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
            <MapPin size={10} className="sm:hidden flex-shrink-0" />
            <MapPin size={12} className="hidden sm:block flex-shrink-0" />
            <span className="line-clamp-1 break-all">{property.location}</span>
          </div>
        </div>

        {/* Status Badge - responsive sizing */}
        <div className="flex-shrink-0">
          {isLoadingStatus ? (
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
              <Loader2 size={10} className="animate-spin sm:hidden" />
              <Loader2 size={12} className="animate-spin hidden sm:block" />
              <span className="hidden sm:inline">Loading...</span>
            </div>
          ) : (
            <StatusBadge status={currentStatus} />
          )}
        </div>
      </div>

      {/* Price - responsive design */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 p-2.5 sm:p-3 rounded-xl">
          <div className="w-full">
            <p className="text-lg sm:text-xl font-bold text-white break-words">
              {formatPrice(property.price)}
            </p>
            <p className="text-xs text-white/90">per month</p>
          </div>
        </div>
      </div>

      {/* Description - responsive text handling */}
      {property.description && (
        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-2 leading-relaxed break-words">
            {property.description}
          </p>
        </div>
      )}

      {/* Actions - responsive button layout */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
        <EditButton
          property={property}
          onEdit={onEdit}
          size="default"
          variant="default"
          fullWidth={true}
        />
        <ToggleStatusButton
          property={property}
          onStatusUpdate={handleStatusUpdate}
          onStatusFetched={handleStatusFetched}
          size="default"
          fullWidth={true}
        />
      </div>

      {/* Hover Effect Decoration - responsive positioning */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
      </div>
    </div>
  )
}
