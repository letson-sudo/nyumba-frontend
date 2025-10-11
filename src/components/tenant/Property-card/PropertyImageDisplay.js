"use client"
import React from "react"
import { Heart, Camera } from "lucide-react"

const PropertyImageDisplay = ({
  house,
  hasActiveAccess,
  onToggleFavorite,
  daysRemaining,
  laravelApiBase,
  statusComponent = null
}) => {
  // Enhanced image error handling with multiple fallback attempts
  const handleImageError = (e, house) => {
    console.error("❌ Failed to load image for property:", house.id, house.image)

    const baseUrl = laravelApiBase || 'http://localhost:8000'
    const originalPath = house.image
    const filename = originalPath.includes('/') ?
      originalPath.split('/').pop() :
      originalPath

    const fallbackPaths = [
      `${baseUrl}/storage/${originalPath}`,
      `${baseUrl}/storage/property-images/${filename}`,
      `${baseUrl}/property-images/${filename}`,
      `${baseUrl}/images/property-images/${filename}`,
      `${baseUrl}/public/storage/property-images/${filename}`,
      `${baseUrl}/storage/app/public/property-images/${filename}`,
      `${baseUrl}/images/placeholder-property.jpg`,
      `${baseUrl}/images/no-image-available.png`,
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='
    ]

    const currentSrc = e.target.src
    let nextFallbackIndex = 0

    for (let i = 0; i < fallbackPaths.length; i++) {
      if (currentSrc.includes(fallbackPaths[i]) || currentSrc === fallbackPaths[i]) {
        nextFallbackIndex = i + 1
        break
      }
    }

    if (nextFallbackIndex < fallbackPaths.length) {
      console.log(`🔄 Trying fallback ${nextFallbackIndex + 1} for property ${house.id}:`, fallbackPaths[nextFallbackIndex])
      e.target.src = fallbackPaths[nextFallbackIndex]
    } else {
      console.error(`❌ All image fallbacks failed for property ${house.id}`)
      e.target.style.display = 'none'

      const parentDiv = e.target.parentElement
      if (parentDiv && !parentDiv.querySelector('.image-error-placeholder')) {
        const placeholder = document.createElement('div')
        placeholder.className = 'image-error-placeholder w-full h-56 bg-gray-200 flex items-center justify-center'
        placeholder.innerHTML = `
          <div class="text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-sm">Image not available</p>
          </div>
        `
        parentDiv.insertBefore(placeholder, e.target)
      }
    }
  }

  // Image count badge component
  const ImageCountBadge = ({ imageCount }) => {
    if (!hasActiveAccess || !imageCount || imageCount <= 1) return null

    return (
      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
        <Camera className="w-3 h-3 mr-1" />
        {imageCount}
      </div>
    )
  }

  const imageCount = house.image_count || (house.images ? house.images.length : 0)

  return (
    <div className="relative">
      {/* Main Property Image */}
      <img
        src={house.image}
        alt={house.title}
        className={`w-full h-56 object-cover transition-all duration-300 ${
          !hasActiveAccess ? 'filter blur-sm grayscale' : ''
        }`}
        onError={(e) => handleImageError(e, house)}
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Status Badge - Rendered from parent/external component */}
      {statusComponent && (
        <div className="absolute top-2 left-2">
          {statusComponent}
        </div>
      )}

      {/* Image Count Badge */}
      <ImageCountBadge imageCount={imageCount} />

      {/* Favorite Button */}
      <button
        onClick={() => hasActiveAccess && onToggleFavorite && onToggleFavorite(house.id)}
        className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
          hasActiveAccess
            ? 'bg-white/90 hover:bg-white'
            : 'bg-gray-500/50 cursor-not-allowed'
        }`}
        disabled={!hasActiveAccess}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            !hasActiveAccess
              ? "text-gray-300"
              : house.isFavorite
              ? "text-red-500 fill-current"
              : "text-gray-600 hover:text-red-400"
          }`}
        />
      </button>

      {/* Subscription Status Badge */}
      {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
        <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          {daysRemaining} days left
        </div>
      )}

      {/* Price Display */}
      <div className={`absolute bottom-4 left-4 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-base shadow-sm ${
        hasActiveAccess
          ? 'bg-white/95 text-gray-900'
          : 'bg-gray-500/50 text-gray-200'
      }`}>
        {hasActiveAccess ? house.price : '••••••'}
        {hasActiveAccess && house.price && (
          <span className="text-xs font-normal text-gray-600 ml-1">/month</span>
        )}
      </div>
    </div>
  )
}

export default PropertyImageDisplay
