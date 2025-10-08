"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import StatusBadge from "../../properties-section/StatusBadge";
import usePropertyStatus from "../../properties-section/hooks/usePropertyStatus";
import PropertyDataDisplay from "./PropertyDataDisplay";
import PropertyImageDisplay from "./PropertyImageDisplay";
import PropertyActionButton from "./PropertyActionButton";

const HouseCard = ({
  house,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite,
  laravelApiBase
}) => {
  const router = useRouter();

  // Use the property status hook to fetch real-time status
  const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

  // Determine if features should be active
  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

  // Get subscription status message
  const getSubscriptionMessage = () => {
    if (!isSubscribed) return "Subscribe to unlock";
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
    if (subscriptionStatus === 'canceled') return "Subscription canceled";
    return "Subscribe to unlock";
  };

  // Get location text based on access
  const getLocationText = () => {
    if (hasActiveAccess) {
      return house.location || 'Location not provided';
    }
    return getSubscriptionMessage();
  };

  // Handle booking/viewing action
  const handleBookViewing = (propertyId) => {
    if (hasActiveAccess && propertyId) {
      router.push(`/properties/${propertyId}`);
    }
  };

  // Use fetched status with fallback to house.status
  const propertyStatus = fetchedStatus || house.status || 'vacant';

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
  ) : null;

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
  );
};

export default HouseCard;

// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import StatusBadge from "../../properties-section/StatusBadge";
// import usePropertyStatus from "../../properties-section/hooks/usePropertyStatus";

// // ===============================
// // Property Card (Data only)
// // ===============================
// const PropertyCard = ({ house, laravelApiBase }) => {
//   // Use the property status hook
//   const { status: fetchedStatus } = usePropertyStatus(house?.id);

//   // Status
//   const propertyStatus = fetchedStatus || house?.status || "vacant";

//   // Badge
//   const statusBadgeComponent = useMemo(() => {
//     return propertyStatus ? (
//       <StatusBadge status={propertyStatus} size="small" showIcon={true} showText={true} />
//     ) : null;
//   }, [propertyStatus]);

//   if (!house || !house.id) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
//         <div className="text-center text-gray-500">
//           <p className="text-sm">Property data not available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
//       {/* Status badge */}
//       <div className="mb-3">{statusBadgeComponent}</div>

//       {/* Property details */}
//       <h3 className="text-lg font-semibold text-gray-800">{house?.title || "Untitled Property"}</h3>
//       <p className="text-sm text-gray-600 mt-1">{house?.description || "No description available."}</p>

//       <div className="mt-4">
//         <p className="text-base font-medium text-gray-900">Price: {house?.price ? `MWK ${house.price}` : "N/A"}</p>
//         <p className="text-sm text-gray-700">Location: {house?.location || "Location not available"}</p>
//       </div>
//     </div>
//   );
// };

// // =======================================
// // Property List (Data only)
// // =======================================
// const PropertyList = ({ userLocation, laravelApiBase }) => {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch properties
//   useEffect(() => {
//     fetchProperties();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userLocation]);

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const apiBase = laravelApiBase || process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

//       const params = new URLSearchParams({
//         location: userLocation || "Lilongwe, Malawi",
//         per_page: "12"
//       });

//       const apiUrl = `${apiBase}/api/properties?${params}`;

//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText} - ${errorText}`);
//       }

//       const data = await response.json();

//       let properties = [];

//       if (data.success || data.status === "success") {
//         properties = data.properties || data.data || [];
//       } else if (Array.isArray(data)) {
//         properties = data;
//       } else {
//         throw new Error(data.message || "Invalid response format from properties API");
//       }

//       setProperties(properties);
//     } catch (error) {
//       setError(error.message || "Failed to load properties");
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return <p className="text-center py-6 text-gray-500">Loading properties...</p>;
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="text-center py-6 text-red-600">
//         <p>{error}</p>
//         <button
//           onClick={fetchProperties}
//           className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Empty state
//   if (properties.length === 0) {
//     return (
//       <div className="text-center py-6 text-gray-600">
//         <p>No properties found in "{userLocation}"</p>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//       {properties.map((house) => (
//         <PropertyCard key={house.id} house={house} laravelApiBase={laravelApiBase} />
//       ))}
//     </div>
//   );
// };

// export default PropertyList;

