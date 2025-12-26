// // components/properties/HouseCard.jsx
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { MapPin, Heart, Star, Calendar, Lock, Clock, Camera, Loader2 } from 'lucide-react';
// import StatusBadge from '../ui/StatusBadge';
// import usePropertyStatus from '../properties-section/hooks/usePropertyStatus';
// import ImageCountBadge from './ImageCountBadge';
// import SubscriptionOverlay from './SubscriptionOverlay';
// import { useImageHandler } from '../../hooks/useImageHandler';
// import useFavoriteHandler from './useFavoriteHandler';

// const HouseCard = ({
//   house,
//   isSubscribed,
//   subscriptionStatus,
//   daysRemaining = 0,
//   onToggleFavorite, // Optional callback for parent component
//   laravelApiBase,
//   onFavoriteUpdate, // Callback to update parent state
// }) => {
//   const router = useRouter();
//   const { handleImageError } = useImageHandler(laravelApiBase);
//   const { handleToggleFavorite, favoriteLoading } = useFavoriteHandler(laravelApiBase);

//   // Use the property status hook to fetch real-time status
//   const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

//   const handleBook = (id) => {
//     if (isSubscribed && id) {
//       router.push(`/properties/${id}`);
//     }
//   };

//   // Determine if features should be active
//   const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

//   // Handle favorite button click
//   const handleFavoriteClick = async () => {
//     if (!hasActiveAccess) return;

//     const result = await handleToggleFavorite(house.id, house.isFavorite);

//     if (result.success) {
//       // Call parent callback if provided
//       if (onToggleFavorite) {
//         onToggleFavorite(house.id, result.newStatus);
//       }

//       // Call favorite update callback
//       if (onFavoriteUpdate) {
//         onFavoriteUpdate(house.id, result.newStatus);
//       }

//       // Optional: You can add a simple success indicator here
//       // For example, change the button color temporarily
//     } else {
//       // Handle error - you could show a simple alert or update UI state
//       console.error('Failed to toggle favorite:', result.error);
//       // You could set an error state here to show in the UI
//     }
//   };

//   // Get subscription status message
//   const getSubscriptionMessage = () => {
//     if (!isSubscribed) return "Subscribe to unlock";
//     if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
//     if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
//     if (subscriptionStatus === 'canceled') return "Subscription canceled";
//     return "Subscribe to unlock";
//   };

//   // Use fetched status with fallback to house.status
//   const propertyStatus = fetchedStatus || house.status || 'vacant';
//   const isPropertyAvailable = propertyStatus === 'vacant' || propertyStatus === 'available';

//   const getLocationText = () => {
//     if (hasActiveAccess) {
//       return house.location || 'Location not provided';
//     }
//     return getSubscriptionMessage();
//   };

//   const getButtonText = () => {
//     if (!hasActiveAccess) return getSubscriptionMessage();
//     if (!isPropertyAvailable) {
//       switch (propertyStatus) {
//         case 'booked':
//           return "Currently Occupied";
//         case 'maintenance':
//           return "Under Maintenance";
//         case 'unavailable':
//           return "Not Available";
//         default:
//           return "Currently Occupied";
//       }
//     }
//     return "Book Viewing";
//   };

//   const getButtonIcon = () => {
//     if (!hasActiveAccess) return <Lock className="mr-1 text-sm" />;
//     if (!isPropertyAvailable) return <Clock className="mr-1 text-sm" />;
//     return <Calendar className="mr-1 text-sm" />;
//   };

//   // Check if this property has a real image or is using placeholder
//   const isPlaceholderImage = house.image && house.image.startsWith('data:image/svg+xml');

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative">
//       {/* Subscription Status Overlay */}
//       {!hasActiveAccess && (
//         <SubscriptionOverlay
//           subscriptionStatus={subscriptionStatus}
//           daysRemaining={daysRemaining}
//         />
//       )}

//       <div className="relative">
//         <img
//           src={house.image}
//           alt={house.title}
//           className={`w-full h-56 object-cover transition-all duration-300 ${
//             !hasActiveAccess ? 'filter blur-sm grayscale' : ''
//           } ${isPlaceholderImage ? 'bg-gray-100' : ''}`}
//           onError={(e) => handleImageError(e, house)}
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

//         {/* No Image Indicator for properties without real images */}
//         {hasActiveAccess && !house.hasRealImage && (
//           <div className="absolute top-2 left-2 bg-gray-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
//             <Camera className="w-3 h-3 mr-1" />
//             No Photo
//           </div>
//         )}

//         {/* Property Status Badge */}
//         {hasActiveAccess && propertyStatus && house.hasRealImage && (
//           <div className="absolute top-2 left-2">
//             <StatusBadge
//               status={propertyStatus}
//               size="small"
//               showIcon={true}
//               showText={true}
//             />
//           </div>
//         )}

//         {/* Property Status Badge for properties without images */}
//         {hasActiveAccess && propertyStatus && !house.hasRealImage && (
//           <div className="absolute top-8 left-2">
//             <StatusBadge
//               status={propertyStatus}
//               size="small"
//               showIcon={true}
//               showText={true}
//             />
//           </div>
//         )}

//         {/* Status loading indicator for non-subscribed users */}
//         {!hasActiveAccess && (
//           <div className="absolute top-2 right-2 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//             {statusLoading ? '...' : 'LOCKED'}
//           </div>
//         )}

//         {/* Image Count Badge */}
//         {house.hasRealImage && (
//           <ImageCountBadge house={house} hasActiveAccess={hasActiveAccess} />
//         )}

//         {/* Favorite Button */}
//         <button
//           onClick={handleFavoriteClick}
//           className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
//             hasActiveAccess
//               ? 'bg-white/90 hover:bg-white'
//               : 'bg-gray-500/50 cursor-not-allowed'
//           } ${favoriteLoading[house.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
//           disabled={!hasActiveAccess || favoriteLoading[house.id]}
//           title={hasActiveAccess ? (house.isFavorite ? "Remove from favorites" : "Add to favorites") : "Subscribe to favorite"}
//         >
//           {favoriteLoading[house.id] ? (
//             <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
//           ) : (
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 !hasActiveAccess
//                   ? "text-gray-300"
//                   : house.isFavorite
//                   ? "text-red-500 fill-current animate-pulse"
//                   : "text-gray-600 hover:text-red-400"
//               }`}
//             />
//           )}
//         </button>

//         {/* Subscription Status Badge */}
//         {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
//           <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
//             {daysRemaining} days left
//           </div>
//         )}

//         {/* Price */}
//         <div className={`absolute bottom-4 left-4 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-base shadow-sm ${
//           hasActiveAccess
//             ? 'bg-white/95 text-gray-900'
//             : 'bg-gray-500/50 text-gray-200'
//         }`}>
//           {hasActiveAccess ? house.price : '••••••'}
//           {hasActiveAccess && house.price && (
//             <span className="text-xs font-normal text-gray-600 ml-1">/month</span>
//           )}
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="flex justify-between items-start mb-3">
//           <h3 className={`font-bold text-sm leading-tight truncate pr-2 ${
//             hasActiveAccess ? 'text-gray-900' : 'text-gray-400'
//           }`}>
//             {hasActiveAccess ? house.title : '•••••••••••••'}
//           </h3>
//           {/* Rating */}
//           {house.rating && (
//             <div className={`flex items-center px-2 py-1 rounded-lg ${
//               hasActiveAccess ? 'bg-yellow-50' : 'bg-gray-100'
//             }`}>
//               <Star className={`w-4 h-4 ${
//                 hasActiveAccess
//                   ? 'text-yellow-500 fill-current'
//                   : 'text-gray-300'
//               }`} />
//               <span className={`ml-1 text-sm font-semibold ${
//                 hasActiveAccess ? 'text-gray-700' : 'text-gray-400'
//               }`}>
//                 {hasActiveAccess ? house.rating.toString() : '•.•'}
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center text-gray-600 mb-6">
//           <MapPin className="w-4 h-4 mr-2 text-gray-400" />
//           <span className={`text-sm font-medium ${
//             hasActiveAccess ? 'text-gray-600' : 'text-gray-400'
//           }`}>
//             {getLocationText()}
//           </span>
//         </div>

//         {/* Action Button */}
//         <button
//           onClick={() => handleBook(house.id)}
//           className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
//             hasActiveAccess && isPropertyAvailable
//               ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
//               : "bg-gray-200 text-gray-500 cursor-not-allowed"
//           }`}
//           disabled={!hasActiveAccess || !isPropertyAvailable}
//         >
//           <div className="flex items-center justify-center">
//             {getButtonIcon()}
//             {getButtonText()}
//           </div>
//         </button>

//         {/* Subscription Info */}
//         {!hasActiveAccess && (
//           <div className="mt-3 text-center text-xs text-gray-500">
//             {subscriptionStatus === 'processing'
//               ? 'Payment being processed'
//               : daysRemaining === 0 && subscriptionStatus === 'active'
//               ? 'Subscription expired - Renew to continue'
//               : 'Premium feature - Subscribe to unlock'
//             }
//           </div>
//         )}

//         {/* Image status indicator for properties without real images */}
//         {hasActiveAccess && !house.hasRealImage && (
//           <div className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center">
//             <Camera className="w-3 h-3 mr-1" />
//             Photos coming soon
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HouseCard;



// components/properties/HouseCard.jsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Heart, Star, Calendar, Lock, Clock, Camera, Loader2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import usePropertyStatus from '../properties-section/hooks/usePropertyStatus';
import ImageCountBadge from './ImageCountBadge';
import SubscriptionOverlay from './SubscriptionOverlay';
import { useImageHandler } from '../../hooks/useImageHandler';
import useFavoriteHandler from './useFavoriteHandler';

const HouseCard = ({
  house,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite, // Optional callback for parent component
  laravelApiBase,
  onFavoriteUpdate, // Callback to update parent state
}) => {
  const router = useRouter();
  const { handleImageError } = useImageHandler(laravelApiBase);
  const { handleToggleFavorite, favoriteLoading } = useFavoriteHandler(laravelApiBase);

  // Use the property status hook to fetch real-time status
  const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

  const handleBook = (id) => {
    if (isSubscribed && id) {
      router.push(`/properties/${id}`);
    }
  };

  // Determine if features should be active
  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

  // Handle favorite button click
  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Prevent event bubbling

    if (!hasActiveAccess) return;

    try {
      const result = await handleToggleFavorite(house.id, house.isFavorite);

      if (result.success) {
        // Call parent callback if provided
        if (onToggleFavorite) {
          onToggleFavorite(house.id, result.newStatus);
        }

        // Call favorite update callback
        if (onFavoriteUpdate) {
          onFavoriteUpdate(house.id, result.newStatus);
        }

        // Optional: You can add a simple success indicator here
        // For example, change the button color temporarily
        console.log('Favorite toggled successfully:', result.newStatus);
      } else {
        // Handle error - you could show a simple alert or update UI state
        console.error('Failed to toggle favorite:', result.error);
        // You could set an error state here to show in the UI
      }
    } catch (error) {
      console.error('Error in handleFavoriteClick:', error);
    }
  };

  // Get subscription status message
  const getSubscriptionMessage = () => {
    if (!isSubscribed) return "Subscribe to unlock";
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
    if (subscriptionStatus === 'canceled') return "Subscription canceled";
    return "Subscribe to unlock";
  };

  // Use fetched status with fallback to house.status
  const propertyStatus = fetchedStatus || house.status || 'vacant';
  const isPropertyAvailable = propertyStatus === 'vacant' || propertyStatus === 'available';

  const getLocationText = () => {
    if (hasActiveAccess) {
      return house.location || 'Location not provided';
    }
    return getSubscriptionMessage();
  };

  const getButtonText = () => {
    if (!hasActiveAccess) return getSubscriptionMessage();
    if (!isPropertyAvailable) {
      switch (propertyStatus) {
        case 'booked':
          return "Currently Occupied";
        case 'maintenance':
          return "Under Maintenance";
        case 'unavailable':
          return "Not Available";
        default:
          return "Currently Occupied";
      }
    }
    return "Book Viewing";
  };

  const getButtonIcon = () => {
    if (!hasActiveAccess) return <Lock className="mr-1 text-sm" />;
    if (!isPropertyAvailable) return <Clock className="mr-1 text-sm" />;
    return <Calendar className="mr-1 text-sm" />;
  };

  // Check if this property has a real image or is using placeholder
  const isPlaceholderImage = house.image && house.image.startsWith('data:image/svg+xml');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative">
      {/* Subscription Status Overlay */}
      {!hasActiveAccess && (
        <SubscriptionOverlay
          subscriptionStatus={subscriptionStatus}
          daysRemaining={daysRemaining}
        />
      )}

      <div className="relative">
        <img
          src={house.image}
          alt={house.title}
          className={`w-full h-56 object-cover transition-all duration-300 ${
            !hasActiveAccess ? 'filter blur-sm grayscale' : ''
          } ${isPlaceholderImage ? 'bg-gray-100' : ''}`}
          onError={(e) => handleImageError(e, house)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* No Image Indicator for properties without real images */}
        {hasActiveAccess && !house.hasRealImage && (
          <div className="absolute top-2 left-2 bg-gray-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Camera className="w-3 h-3 mr-1" />
            No Photo
          </div>
        )}

        {/* Property Status Badge */}
        {hasActiveAccess && propertyStatus && house.hasRealImage && (
          <div className="absolute top-2 left-2">
            <StatusBadge
              status={propertyStatus}
              size="small"
              showIcon={true}
              showText={true}
            />
          </div>
        )}

        {/* Property Status Badge for properties without images */}
        {hasActiveAccess && propertyStatus && !house.hasRealImage && (
          <div className="absolute top-8 left-2">
            <StatusBadge
              status={propertyStatus}
              size="small"
              showIcon={true}
              showText={true}
            />
          </div>
        )}

        {/* Status loading indicator for non-subscribed users */}
        {!hasActiveAccess && (
          <div className="absolute top-2 right-2 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {statusLoading ? '...' : 'LOCKED'}
          </div>
        )}

        {/* Image Count Badge */}
        {house.hasRealImage && (
          <ImageCountBadge house={house} hasActiveAccess={hasActiveAccess} />
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
            hasActiveAccess
              ? 'bg-white/90 hover:bg-white hover:scale-110'
              : 'bg-gray-500/50 cursor-not-allowed'
          } ${favoriteLoading[house.id] ? 'opacity-50 cursor-not-allowed scale-95' : ''}`}
          disabled={!hasActiveAccess || favoriteLoading[house.id]}
          title={hasActiveAccess ? (house.isFavorite ? "Remove from favorites" : "Add to favorites") : "Subscribe to favorite"}
        >
          {favoriteLoading[house.id] ? (
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
          ) : (
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                !hasActiveAccess
                  ? "text-gray-300"
                  : house.isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-600 hover:text-red-400"
              }`}
            />
          )}
        </button>

        {/* Subscription Status Badge */}
        {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {daysRemaining} days left
          </div>
        )}

        {/* Price */}
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

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-sm leading-tight truncate pr-2 ${
            hasActiveAccess ? 'text-gray-900' : 'text-gray-400'
          }`}>
            {hasActiveAccess ? house.title : '•••••••••••••'}
          </h3>
          {/* Rating */}
          {house.rating && (
            <div className={`flex items-center px-2 py-1 rounded-lg ${
              hasActiveAccess ? 'bg-yellow-50' : 'bg-gray-100'
            }`}>
              <Star className={`w-4 h-4 ${
                hasActiveAccess
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              }`} />
              <span className={`ml-1 text-sm font-semibold ${
                hasActiveAccess ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {hasActiveAccess ? house.rating.toString() : '•.•'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className={`text-sm font-medium ${
            hasActiveAccess ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {getLocationText()}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleBook(house.id)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
            hasActiveAccess && isPropertyAvailable
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!hasActiveAccess || !isPropertyAvailable}
        >
          <div className="flex items-center justify-center">
            {getButtonIcon()}
            {getButtonText()}
          </div>
        </button>

        {/* Subscription Info */}
        {!hasActiveAccess && (
          <div className="mt-3 text-center text-xs text-gray-500">
            {subscriptionStatus === 'processing'
              ? 'Payment being processed'
              : daysRemaining === 0 && subscriptionStatus === 'active'
              ? 'Subscription expired - Renew to continue'
              : 'Premium feature - Subscribe to unlock'
            }
          </div>
        )}

        {/* Image status indicator for properties without real images */}
        {hasActiveAccess && !house.hasRealImage && (
          <div className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center">
            <Camera className="w-3 h-3 mr-1" />
            Photos coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseCard;
