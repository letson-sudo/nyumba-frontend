// components/properties/LocationStatusBanner.jsx
import React from 'react';
import { MapPin, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Helper function to clean location for backend
const cleanLocationForBackend = (locationString) => {
  if (!locationString || typeof locationString !== 'string') return '';
  const trimmed = locationString.trim();
  const cityOnly = trimmed.split(',')[0].trim();
  return cityOnly;
};

const LocationStatusBanner = ({
  userLocation,
  locationMetadata,
  locationStrategy = 'basic',
  fallbackStrategy = 'random',
  toggleLocationStrategy,
  toggleFallbackStrategy,
  showDebugControls = false
}) => {
  // Case 1: Location metadata available (detailed response from API)
  if (userLocation && locationMetadata) {
    const isSuccess = locationMetadata.location_match;
    const cleanedLocation = cleanLocationForBackend(userLocation);

    return (
      <div className={`border rounded-lg p-4 transition-all duration-200 ${
        isSuccess
          ? 'bg-green-50 border-green-200'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Info className="w-4 h-4 text-blue-600" />
              )}
            </div>

            <div className="ml-3 flex-1 min-w-0">
              {/* Main message */}
              <p className={`text-sm font-medium ${
                isSuccess ? 'text-green-800' : 'text-blue-800'
              }`}>
                {locationMetadata.message || (isSuccess
                  ? `Found properties in ${cleanedLocation}`
                  : `Showing properties near ${cleanedLocation}`
                )}
              </p>

              {/* Metadata details */}
              <div className="mt-1 text-xs text-gray-600 space-y-1">
                <div>
                  Strategy: <span className="font-medium">{locationMetadata.strategy_used || locationStrategy}</span>
                  {locationMetadata.total_returned && (
                    <span> • Found: <span className="font-medium">{locationMetadata.total_returned}</span> properties</span>
                  )}
                </div>

                {/* Show search term if different from input */}
                {userLocation !== cleanedLocation && (
                  <div className="text-gray-500">
                    Searched for: "{cleanedLocation}" (from "{userLocation}")
                  </div>
                )}

                {/* Additional metadata */}
                {locationMetadata.fallback_used && (
                  <div className="text-gray-500">
                    Fallback strategy used: {locationMetadata.fallback_strategy || fallbackStrategy}
                  </div>
                )}

                {locationMetadata.search_radius && (
                  <div className="text-gray-500">
                    Search radius: {locationMetadata.search_radius}km
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Debug Controls */}
          {showDebugControls && (
            <div className="flex-shrink-0 flex flex-col gap-2">
              {toggleLocationStrategy && (
                <button
                  onClick={toggleLocationStrategy}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
                  title="Toggle between basic and advanced location search"
                >
                  {locationStrategy === 'basic' ? 'Use Advanced' : 'Use Basic'}
                </button>
              )}

              {locationStrategy === 'advanced' && toggleFallbackStrategy && (
                <button
                  onClick={toggleFallbackStrategy}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
                  title="Cycle through fallback strategies"
                >
                  Fallback: {fallbackStrategy}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-3 flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isSuccess ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>
          <span className={`text-xs ${
            isSuccess ? 'text-green-700' : 'text-blue-700'
          }`}>
            {isSuccess ? 'Exact location match' : 'Showing nearby properties'}
          </span>

          {locationMetadata.total_returned && (
            <span className="ml-2 text-xs text-gray-500">
              • {locationMetadata.total_returned} results
            </span>
          )}
        </div>
      </div>
    );
  }

  // Case 2: User location provided but no metadata (basic response)
  if (userLocation && !locationMetadata) {
    const cleanedLocation = cleanLocationForBackend(userLocation);

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start flex-1">
            <MapPin className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-blue-800 text-sm font-medium">
                Properties prioritized for: <span className="font-semibold">{cleanedLocation}</span>
              </p>

              {userLocation !== cleanedLocation && (
                <p className="text-xs text-blue-600 mt-1">
                  Original input: "{userLocation}"
                </p>
              )}

              <div className="mt-2 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs text-blue-700">Location-based sorting active</span>
              </div>
            </div>
          </div>

          {/* Simple debug control */}
          {showDebugControls && toggleLocationStrategy && (
            <div className="flex-shrink-0">
              <button
                onClick={toggleLocationStrategy}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                Strategy: {locationStrategy}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 3: No location provided
  if (!userLocation) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-3 text-gray-500" />
          <div>
            <p className="text-gray-700 text-sm font-medium">
              Showing all available properties
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Set your location for personalized, nearby results
            </p>

            <div className="mt-2 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Default sorting by relevance</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - shouldn't reach here but just in case
  return null;
};

export default LocationStatusBanner;
