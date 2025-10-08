// components/properties/PropertyListContainer.jsx
"use client";
import React from 'react';
import { RefreshCw, Camera, Database } from 'lucide-react';
import HouseCard from './HouseCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import ErrorDisplay from './ErrorDisplay';
import LocationStatusBanner from './LocationStatusBanner';
import { usePropertyData } from '../../hooks/usePropertyData';
import { cleanLocationForBackend } from './utils/imageUtils';

const PropertyListContainer = ({
  userLocation,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite
}) => {
  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

  const {
    properties,
    locations,
    loading,
    error,
    locationMetadata,
    locationStrategy,
    fallbackStrategy,
    handleRetry,
    toggleLocationStrategy,
    toggleFallbackStrategy,
    sortPropertiesByLocation
  } = usePropertyData(userLocation, LARAVEL_API_BASE);

  const sortedProperties = sortPropertiesByLocation(properties, userLocation);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
            <p className="text-gray-700 text-base font-medium">Loading Properties</p>
            <p className="text-gray-500 text-sm mt-1">
              {userLocation
                ? `Searching for properties in ${userLocation}...`
                : 'Fetching from Laravel backend...'
              }
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {userLocation
                ? `${LARAVEL_API_BASE}/api/tenant/properties/location`
                : `${LARAVEL_API_BASE}/api/tenant/properties/all`
              }
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        errorType={error}
        onRetry={handleRetry}
        retryCount={0}
        laravelApiBase={LARAVEL_API_BASE}
      />
    );
  }

  if (!sortedProperties.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 max-w-md mx-auto">
          <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-700 font-bold text-xl mb-2">No Properties Available</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {userLocation
              ? `No properties found in ${userLocation} and no fallback properties available.`
              : 'The Laravel backend returned no properties.'
            }
          </p>
          <p className="text-gray-400 text-xs mb-4">
            API Endpoint: {userLocation ? `${LARAVEL_API_BASE}/api/tenant/properties/location` : `${LARAVEL_API_BASE}/api/tenant/properties/all`}<br/>
            Images served from: {LARAVEL_API_BASE}/storage/property-images/
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh from Backend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Search Status */}
      <LocationStatusBanner
        userLocation={userLocation}
        locationMetadata={locationMetadata}
        locationStrategy={locationStrategy}
        fallbackStrategy={fallbackStrategy}
        toggleLocationStrategy={toggleLocationStrategy}
        toggleFallbackStrategy={toggleFallbackStrategy}
      />

      {/* Properties Summary */}
      {sortedProperties.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Showing {sortedProperties.length} properties
            ({sortedProperties.filter(p => p.hasRealImage).length} with images, {' '}
            {sortedProperties.filter(p => !p.hasRealImage).length} with placeholder images)
          </p>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProperties.map((property) => (
          <HouseCard
            key={property.id}
            house={property}
            isSubscribed={isSubscribed}
            subscriptionStatus={subscriptionStatus}
            daysRemaining={daysRemaining}
            onToggleFavorite={onToggleFavorite}
            laravelApiBase={LARAVEL_API_BASE}
          />
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-gray-500 text-sm flex items-center justify-center">
          <Database className="w-4 h-4 mr-2" />
          Displaying {sortedProperties.length} properties from Laravel backend
          {userLocation && ` (Location: ${userLocation})`}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          API: {userLocation ? `${LARAVEL_API_BASE}/api/tenant/properties/location` : `${LARAVEL_API_BASE}/api/tenant/properties/all`}<br/>
          Strategy: {locationStrategy} • Fallback: {fallbackStrategy}<br/>
          Images: {LARAVEL_API_BASE}/storage/property-images/
        </p>
      </div>
    </div>
  );
};

export default PropertyListContainer;
