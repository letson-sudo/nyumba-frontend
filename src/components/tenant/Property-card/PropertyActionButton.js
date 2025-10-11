"use client"
import React from "react"
import { Lock, Clock, Calendar } from "lucide-react"

const PropertyActionButton = ({
  house,
  hasActiveAccess,
  propertyStatus,
  onBookViewing,
  getSubscriptionMessage,
  subscriptionStatus,
  daysRemaining
}) => {
  // Check if property is available for booking
  const isPropertyAvailable = propertyStatus === 'vacant' || propertyStatus === 'available'

  // Get appropriate button text based on access and property status
  const getButtonText = () => {
    if (!hasActiveAccess) {
      return getSubscriptionMessage()
    }

    if (!isPropertyAvailable) {
      switch (propertyStatus) {
        case 'booked':
          return "Currently Occupied"
        case 'maintenance':
          return "Under Maintenance"
        case 'unavailable':
          return "Not Available"
        default:
          return "Currently Occupied"
      }
    }

    return "Book Viewing"
  }

  // Get appropriate icon for button
  const getButtonIcon = () => {
    if (!hasActiveAccess) {
      return <Lock className="mr-1 text-sm" />
    }

    if (!isPropertyAvailable) {
      return <Clock className="mr-1 text-sm" />
    }

    return <Calendar className="mr-1 text-sm" />
  }

  // Get button styling based on state
  const getButtonStyles = () => {
    if (hasActiveAccess && isPropertyAvailable) {
      return "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
    }
    return "bg-gray-200 text-gray-500 cursor-not-allowed"
  }

  // Handle button click
  const handleButtonClick = () => {
    if (hasActiveAccess && isPropertyAvailable && onBookViewing) {
      onBookViewing(house.id)
    }
  }

  return (
    <div className="space-y-3">
      {/* Main Action Button */}
      <button
        onClick={handleButtonClick}
        className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${getButtonStyles()}`}
        disabled={!hasActiveAccess || !isPropertyAvailable}
      >
        <div className="flex items-center justify-center">
          {getButtonIcon()}
          {getButtonText()}
        </div>
      </button>

      {/* Additional Information */}
      {!hasActiveAccess && (
        <div className="text-center text-xs text-gray-500">
          {subscriptionStatus === 'processing'
            ? 'Payment being processed'
            : daysRemaining === 0 && subscriptionStatus === 'active'
            ? 'Subscription expired - Renew to continue'
            : 'Premium feature - Subscribe to unlock'
          }
        </div>
      )}

      {/* Property Status Info for unavailable properties */}
      {hasActiveAccess && !isPropertyAvailable && (
        <div className="text-center text-xs text-gray-500">
          {propertyStatus === 'booked' && "This property is currently occupied"}
          {propertyStatus === 'maintenance' && "Property is undergoing maintenance"}
          {propertyStatus === 'unavailable' && "Property is temporarily unavailable"}
        </div>
      )}

      {/* Subscription Warning for expiring subscriptions */}
      {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 3 && (
        <div className="text-center text-xs text-orange-600 bg-orange-50 py-1 px-2 rounded">
          Subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default PropertyActionButton
