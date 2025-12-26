"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import StatusBadge from "../../properties-section/StatusBadge"
import usePropertyStatus from "../../properties-section/hooks/usePropertyStatus"
import PropertyDataDisplay from "./PropertyDataDisplay"
import PropertyImageDisplay from "./PropertyImageDisplay"
import PropertyActionButton from "./PropertyActionButton"

const HouseCard = ({
  house,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite,
  laravelApiBase
}) => {
  const router = useRouter()

  // Use the property status hook to fetch real-time status
  const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id)

  // Determine if features should be active
  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0

  // Get subscription status message
  const getSubscriptionMessage = () => {
    if (!isSubscribed) return "Subscribe to unlock"
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment..."
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired"
    if (subscriptionStatus === 'canceled') return "Subscription canceled"
    return "Subscribe to unlock"
  }

  // Get location text based on access
  const getLocationText = () => {
    if (hasActiveAccess) {
      return house.location || 'Location not provided'
    }
    return getSubscriptionMessage()
  }

  // Handle booking/viewing action
  const handleBookViewing = (propertyId) => {
    if (hasActiveAccess && propertyId) {
      router.push(`/properties/${propertyId}`)
    }
  }

  // Use fetched status with fallback to house.status
  const propertyStatus = fetchedStatus || house.status || 'vacant'

  // Create status badge component
  const statusBadgeComponent = hasActiveAccess && propertyStatus ? (
    <StatusBadge
      status={propertyStatus}
      size="small"
      showIcon={true}
      showText={true}
    />
  ) : !hasActiveAccess ? (
    <div className="bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
      {statusLoading ? '...' : 'LOCKED'}
    </div>
  ) : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative">
      {/* Subscription Status Overlay */}
      {!hasActiveAccess && (
        <div className="absolute inset-0 bg-gray-900/60 z-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-white p-4">
            <Lock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">{getSubscriptionMessage()}</p>
            {subscriptionStatus === 'active' && daysRemaining === 0 && (
              <p className="text-xs mt-1 text-gray-300">Renew to continue access</p>
            )}
            {(subscriptionStatus === 'processing' || subscriptionStatus === 'pending') && (
              <p className="text-xs mt-1 text-gray-300">Please wait for confirmation</p>
            )}
          </div>
        </div>
      )}

      {/* Property Image Component */}
      <PropertyImageDisplay
        house={house}
        hasActiveAccess={hasActiveAccess}
        onToggleFavorite={onToggleFavorite}
        daysRemaining={daysRemaining}
        laravelApiBase={laravelApiBase}
        statusComponent={statusBadgeComponent}
      />

      {/* Property Data Display Component */}
      <PropertyDataDisplay
        house={house}
        hasActiveAccess={hasActiveAccess}
        getLocationText={getLocationText}
        getSubscriptionMessage={getSubscriptionMessage}
      />

      {/* Property Action Button Component */}
      <div className="px-6 pb-6">
        <PropertyActionButton
          house={house}
          hasActiveAccess={hasActiveAccess}
          propertyStatus={propertyStatus}
          onBookViewing={handleBookViewing}
          getSubscriptionMessage={getSubscriptionMessage}
          subscriptionStatus={subscriptionStatus}
          daysRemaining={daysRemaining}
        />
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-6 pb-4">
          {/* Status Debug Info */}
          {hasActiveAccess && (statusLoading || statusError) && (
            <div className="text-center text-xs text-gray-400 mb-2">
              {statusLoading && 'Loading status...'}
              {statusError && 'Status check failed'}
            </div>
          )}

          {/* Image Debug Info */}
          <div className="text-center text-xs text-gray-400 border-t pt-2">
            <p>Image URL: {house.image}</p>
            <p>Image Count: {house.image_count}</p>
            <p>Status: {propertyStatus}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HouseCard




// "use client"

// import React from "react"
// import { useRouter } from "next/navigation"
// import { Lock } from "lucide-react"
// import StatusBadge from "../../properties-section/StatusBadge"
// import usePropertyStatus from "../../properties-section/hooks/usePropertyStatus"
// import PropertyDataDisplay from "./PropertyDataDisplay"
// import PropertyImageDisplay from "./PropertyImageDisplay"
// import PropertyActionButton from "./PropertyActionButton"

// const HouseCard = ({
//   house,
//   isSubscribed,
//   subscriptionStatus,
//   daysRemaining = 0,
//   onToggleFavorite,
//   laravelApiBase
// }) => {
//   const router = useRouter()

//   // Use the property status hook to fetch real-time status
//   const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id)

//   // Determine if features should be active
//   const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0

//   // Get subscription status message
//   const getSubscriptionMessage = () => {
//     if (!isSubscribed) return "Subscribe to unlock"
//     if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment..."
//     if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired"
//     if (subscriptionStatus === 'canceled') return "Subscription canceled"
//     return "Subscribe to unlock"
//   }

//   // Get location text based on access
//   const getLocationText = () => {
//     if (hasActiveAccess) {
//       return house.location || 'Location not provided'
//     }
//     return getSubscriptionMessage()
//   }

//   // Handle card click - redirect to property details
//   const handleCardClick = (e) => {
//     // Allow action button to work independently
//     // Only prevent if clicking favorite or other non-action buttons
//     const isActionButton = e.target.closest('[data-action-button]')
//     const isFavoriteButton = e.target.closest('[data-favorite-button]')
//     const isNoRedirect = e.target.closest('[data-no-redirect]')

//     // If clicking action button, let it handle navigation
//     if (isActionButton) {
//       return
//     }

//     // Prevent navigation only for favorite and other marked elements
//     if (isFavoriteButton || isNoRedirect) {
//       return
//     }

//     // Navigate to property details
//     if (hasActiveAccess && house.id) {
//       router.push(`/properties/${house.id}`)
//     }
//   }

//   // Handle booking/viewing action
//   const handleBookViewing = (propertyId) => {
//     if (hasActiveAccess && propertyId) {
//       router.push(`/properties/${propertyId}`)
//     }
//   }

//   // Use fetched status with fallback to house.status
//   const propertyStatus = fetchedStatus || house.status || 'vacant'

//   // Create status badge component
//   const statusBadgeComponent = hasActiveAccess && propertyStatus ? (
//     <StatusBadge
//       status={propertyStatus}
//       size="small"
//       showIcon={true}
//       showText={true}
//     />
//   ) : !hasActiveAccess ? (
//     <div className="bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//       {statusLoading ? '...' : 'LOCKED'}
//     </div>
//   ) : null

//   return (
//     <div
//       className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative ${
//         hasActiveAccess ? 'cursor-pointer' : 'cursor-not-allowed'
//       }`}
//       onClick={handleCardClick}
//     >
//       {/* Subscription Status Overlay */}
//       {!hasActiveAccess && (
//         <div className="absolute inset-0 bg-gray-900/60 z-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
//           <div className="text-center text-white p-4">
//             <Lock className="w-8 h-8 mx-auto mb-2" />
//             <p className="text-sm font-medium">{getSubscriptionMessage()}</p>
//             {subscriptionStatus === 'active' && daysRemaining === 0 && (
//               <p className="text-xs mt-1 text-gray-300">Renew to continue access</p>
//             )}
//             {(subscriptionStatus === 'processing' || subscriptionStatus === 'pending') && (
//               <p className="text-xs mt-1 text-gray-300">Please wait for confirmation</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Property Image Component */}
//       <PropertyImageDisplay
//         house={house}
//         hasActiveAccess={hasActiveAccess}
//         onToggleFavorite={onToggleFavorite}
//         daysRemaining={daysRemaining}
//         laravelApiBase={laravelApiBase}
//         statusComponent={statusBadgeComponent}
//       />

//       {/* Property Data Display Component */}
//       <PropertyDataDisplay
//         house={house}
//         hasActiveAccess={hasActiveAccess}
//         getLocationText={getLocationText}
//         getSubscriptionMessage={getSubscriptionMessage}
//       />

//       {/* Property Action Button Component */}
//       <div className="px-6 pb-6">
//         <PropertyActionButton
//           house={house}
//           hasActiveAccess={hasActiveAccess}
//           propertyStatus={propertyStatus}
//           onBookViewing={handleBookViewing}
//           getSubscriptionMessage={getSubscriptionMessage}
//           subscriptionStatus={subscriptionStatus}
//           daysRemaining={daysRemaining}
//         />
//       </div>

//       {/* Debug Info (remove in production) */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="px-6 pb-4">
//           {/* Status Debug Info */}
//           {hasActiveAccess && (statusLoading || statusError) && (
//             <div className="text-center text-xs text-gray-400 mb-2">
//               {statusLoading && 'Loading status...'}
//               {statusError && 'Status check failed'}
//             </div>
//           )}

//           {/* Image Debug Info */}
//           <div className="text-center text-xs text-gray-400 border-t pt-2">
//             <p>Image URL: {house.image}</p>
//             <p>Image Count: {house.image_count}</p>
//             <p>Status: {propertyStatus}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default HouseCard
