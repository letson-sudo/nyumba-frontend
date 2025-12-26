// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { MapPin, Heart, Star, Calendar, Lock, Clock, Home, AlertCircle, RefreshCw, Camera, Database, Wifi, WifiOff, MessageCircle, Loader2 } from "lucide-react";
// import StatusBadge from "../properties-section/StatusBadge";
// import usePropertyStatus from "../properties-section/hooks/usePropertyStatus";
// import FallbackImageSVG from './fallback-image-svg';
// import axios from '@/lib/axios';

// // Main container component that handles data fetching
// const PropertyListContainer = ({
//   userLocation,
//   isSubscribed,
//   subscriptionStatus,
//   daysRemaining = 0
// }) => {
//   const [properties, setProperties] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const [favoriteLoading, setFavoriteLoading] = useState({});

//   const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }

//     const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

//     if (cleanPath.startsWith('storage/')) {
//       return `${LARAVEL_API_BASE}/${cleanPath}`;
//     }

//     if (cleanPath.includes('property-images/')) {
//       return `${LARAVEL_API_BASE}/storage/${cleanPath}`;
//     }

//     return `${LARAVEL_API_BASE}/storage/property-images/${cleanPath}`;
//   };

//   const processImageArray = (images) => {
//     if (!Array.isArray(images)) return [];
//     return images.map(img => getImageUrl(img)).filter(Boolean);
//   };

//   const cleanLocationForBackend = (locationString) => {
//     if (!locationString || typeof locationString !== 'string') return '';

//     const trimmed = locationString.trim();
//     const cityOnly = trimmed.split(',')[0].trim();

//     return cityOnly;
//   };

//   const fetchPropertiesByLocation = async (location, strategy = 'basic') => {
//     const cleanedLocation = cleanLocationForBackend(location);

//     if (!cleanedLocation) {
//       throw new Error('INVALID_LOCATION');
//     }

//     const timestamp = new Date().getTime();

//     let apiUrl;
//     if (strategy === 'advanced') {
//       apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location-advanced?location=${encodeURIComponent(cleanedLocation)}&fallback=random&limit=20&t=${timestamp}`;
//     } else {
//       apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location?location=${encodeURIComponent(cleanedLocation)}&limit=20&t=${timestamp}`;
//     }

//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP_${response.status}`);
//     }

//     const data = await response.json();
//     return data.properties || data || [];
//   };

//   const fetchAllProperties = async () => {
//     const timestamp = new Date().getTime();
//     const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/all?t=${timestamp}`;

//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP_${response.status}`);
//     }

//     return await response.json();
//   };

//   // Updated favorite toggle function
//   const handleToggleFavorite = async (propertyId, currentFavoriteState) => {
//     if (favoriteLoading[propertyId]) return;

//     setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

//     // Optimistic UI update
//     const newFavoriteState = !currentFavoriteState;
//     setProperties(prevProperties =>
//       prevProperties.map(property =>
//         property.id === propertyId
//           ? { ...property, isFavorite: newFavoriteState }
//           : property
//       )
//     );

//     try {
//       const response = await axios.post('/api/favorites/toggle', {
//         property_id: propertyId
//       });

//       // Update with actual server state
//       const { is_favorited } = response.data.data;
//       setProperties(prevProperties =>
//         prevProperties.map(property =>
//           property.id === propertyId
//             ? { ...property, isFavorite: is_favorited }
//             : property
//         )
//       );

//     } catch (error) {
//       // Revert optimistic update on error
//       setProperties(prevProperties =>
//         prevProperties.map(property =>
//           property.id === propertyId
//             ? { ...property, isFavorite: currentFavoriteState }
//             : property
//         )
//       );

//       if (error.response?.status === 419) {
//         alert("Session expired. Please refresh the page and try again.");
//       } else if (error.response?.status === 401) {
//         alert("Please log in to add favorites.");
//       } else {
//         alert("Failed to update favorite. Please try again.");
//       }
//     } finally {
//       setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));
//     }
//   };

//   // Main data fetching function
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         let propertiesData = [];

//         if (userLocation && userLocation.trim()) {
//           const cleanedUserLocation = cleanLocationForBackend(userLocation);

//           if (cleanedUserLocation) {
//             try {
//               propertiesData = await fetchPropertiesByLocation(userLocation, 'basic');
//             } catch (locationError) {
//               propertiesData = await fetchAllProperties();
//             }
//           } else {
//             propertiesData = await fetchAllProperties();
//           }
//         } else {
//           propertiesData = await fetchAllProperties();
//         }

//         if (!Array.isArray(propertiesData)) {
//           throw new Error('INVALID_DATA_FORMAT');
//         }

//         const placeholderImage = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=`;

//         const validatedProperties = propertiesData.map(property => {
//           const primaryImage = property.image || property.featured_image ||
//                              (property.images && property.images[0]);
//           const allImages = property.images || (primaryImage ? [primaryImage] : []);
//           const fullImageUrl = getImageUrl(primaryImage);
//           const processedImages = processImageArray(allImages);

//           return {
//             ...property,
//             id: property.id || `temp_${Date.now()}_${Math.random()}`,
//             title: property.title || property.name || 'Untitled Property',
//             price: property.price || property.rent || 'Price not available',
//             location: property.location || property.address || property.city || 'Location not specified',
//             image: fullImageUrl || placeholderImage,
//             images: processedImages.length > 0 ? processedImages : [placeholderImage],
//             image_count: property.image_count || (processedImages.length > 0 ? processedImages.length : 1),
//             hasRealImage: !!fullImageUrl,
//             status: property.status || property.current_status || 'available',
//             rating: property.rating || property.average_rating || null,
//             isFavorite: property.isFavorite || property.is_favorite || false
//           };
//         });

//         setProperties(validatedProperties);

//         try {
//           const timestamp = new Date().getTime();
//           const locationsUrl = `${LARAVEL_API_BASE}/api/tenant/properties/locations?t=${timestamp}`;

//           const locationsResponse = await fetch(locationsUrl, {
//             method: 'GET',
//             headers: {
//               'Cache-Control': 'no-cache',
//               'Pragma': 'no-cache',
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//           });

//           if (locationsResponse.ok) {
//             const locationsData = await locationsResponse.json();
//             setLocations(Array.isArray(locationsData) ? locationsData : []);
//           }
//         } catch (locationsError) {
//           setLocations([]);
//         }

//       } catch (err) {
//         setError(err.message);
//         setProperties([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [retryCount, LARAVEL_API_BASE, userLocation]);

//   const handleRetry = () => {
//     setRetryCount(prev => prev + 1);
//   };

//   const sortPropertiesByLocation = (properties, userLocation) => {
//     if (!userLocation || !properties.length) return properties;

//     const cleanedUserLocation = cleanLocationForBackend(userLocation);
//     const userLocationLower = cleanedUserLocation.toLowerCase();

//     const userLocationProperties = [];
//     const partialMatchProperties = [];
//     const otherLocationProperties = [];

//     properties.forEach(property => {
//       const locationFields = [
//         property.location,
//         property.city,
//         property.address,
//         property.area,
//         property.neighborhood
//       ].filter(Boolean);

//       const exactMatch = locationFields.some(field => {
//         if (!field) return false;
//         const cleanedField = cleanLocationForBackend(field).toLowerCase();
//         return cleanedField === userLocationLower;
//       });

//       const partialMatch = locationFields.some(field => {
//         if (!field) return false;
//         const cleanedField = cleanLocationForBackend(field).toLowerCase();
//         return cleanedField.includes(userLocationLower) || userLocationLower.includes(cleanedField);
//       });

//       if (exactMatch) {
//         userLocationProperties.push(property);
//       } else if (partialMatch) {
//         partialMatchProperties.push(property);
//       } else {
//         otherLocationProperties.push(property);
//       }
//     });

//     return [...userLocationProperties, ...partialMatchProperties, ...otherLocationProperties];
//   };

//   const sortedProperties = sortPropertiesByLocation(properties, userLocation);

//   const renderError = (errorType) => {
//     const errorConfigs = {
//       'API_NOT_FOUND': {
//         icon: <Database className="w-12 h-12 text-red-400" />,
//         title: 'Service Unavailable',
//         message: 'The property listing service is currently unavailable.',
//         suggestion: 'Ensure your Laravel server is running.',
//         color: 'red'
//       },
//       'HTTP_401': {
//         icon: <Lock className="w-12 h-12 text-red-400" />,
//         title: 'Authentication Required',
//         message: 'You need to be authenticated to access property listings.',
//         suggestion: 'Please log in to your account and try again.',
//         color: 'red'
//       },
//       'HTTP_500': {
//         icon: <AlertCircle className="w-12 h-12 text-orange-400" />,
//         title: 'Server Error',
//         message: 'The server encountered an error while processing your request.',
//         suggestion: 'This is usually temporary. Please try again.',
//         color: 'orange'
//       },
//       'HTTP_403': {
//         icon: <Lock className="w-12 h-12 text-purple-400" />,
//         title: 'Access Denied',
//         message: 'You do not have permission to access property listings.',
//         suggestion: 'Please check your authentication credentials.',
//         color: 'purple'
//       },
//       'NETWORK_ERROR': {
//         icon: <WifiOff className="w-12 h-12 text-gray-400" />,
//         title: 'Connection Error',
//         message: 'Unable to connect to the server.',
//         suggestion: 'Verify the backend server is running and your network connection is stable.',
//         color: 'gray'
//       },
//       'INVALID_DATA_FORMAT': {
//         icon: <Database className="w-12 h-12 text-yellow-400" />,
//         title: 'Data Format Error',
//         message: 'The server returned data in an unexpected format.',
//         suggestion: 'This indicates a server-side issue.',
//         color: 'yellow'
//       },
//       'UNKNOWN_ERROR': {
//         icon: <AlertCircle className="w-12 h-12 text-red-400" />,
//         title: 'Unexpected Error',
//         message: 'An unexpected error occurred while loading properties.',
//         suggestion: 'Please try refreshing the page.',
//         color: 'red'
//       }
//     };

//     const config = errorConfigs[errorType] || errorConfigs['UNKNOWN_ERROR'];

//     return (
//       <div className="text-center py-16">
//         <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-xl p-8 max-w-lg mx-auto`}>
//           <div className="flex flex-col items-center">
//             {config.icon}
//             <h3 className={`text-${config.color}-800 font-bold text-xl mt-4 mb-2`}>
//               {config.title}
//             </h3>
//             <p className={`text-${config.color}-700 text-sm mb-4 text-center leading-relaxed`}>
//               {config.message}
//             </p>
//             <p className={`text-${config.color}-600 text-xs mb-6 text-center`}>
//               {config.suggestion}
//             </p>
//             <button
//               onClick={handleRetry}
//               className={`px-6 py-2 bg-${config.color}-600 text-white rounded-lg text-sm hover:bg-${config.color}-700 transition-colors duration-200 flex items-center`}
//             >
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <div className="text-center py-8">
//           <div className="flex flex-col items-center">
//             <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
//             <p className="text-gray-700 text-base font-medium">Loading Properties</p>
//             <p className="text-gray-500 text-sm mt-1">
//               {userLocation
//                 ? `Searching for properties in ${userLocation}...`
//                 : 'Fetching properties...'
//               }
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, index) => (
//             <PropertyCardSkeleton key={index} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return renderError(error);
//   }

//   if (!sortedProperties.length) {
//     return (
//       <div className="text-center py-20">
//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 max-w-md mx-auto">
//           <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//           <h3 className="text-gray-700 font-bold text-xl mb-2">No Properties Available</h3>
//           <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//             {userLocation
//               ? `No properties found in ${userLocation}.`
//               : 'No properties available at the moment.'
//             }
//           </p>
//           <button
//             onClick={handleRetry}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {userLocation && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <p className="text-blue-800 text-sm flex items-center">
//             <MapPin className="w-4 h-4 mr-2" />
//             Showing properties for: <strong className="ml-1">{cleanLocationForBackend(userLocation)}</strong>
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {sortedProperties.map((property) => (
//           <HouseCard
//             key={property.id}
//             house={property}
//             isSubscribed={isSubscribed}
//             subscriptionStatus={subscriptionStatus}
//             daysRemaining={daysRemaining}
//             onToggleFavorite={handleToggleFavorite}
//             favoriteLoading={favoriteLoading[property.id] || false}
//             laravelApiBase={LARAVEL_API_BASE}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Loading skeleton component
// const PropertyCardSkeleton = () => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
//     <div className="w-full h-56 bg-gray-200"></div>
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-start">
//         <div className="h-6 bg-gray-200 rounded w-2/3"></div>
//         <div className="h-6 bg-gray-200 rounded w-12"></div>
//       </div>
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="h-10 bg-gray-200 rounded"></div>
//     </div>
//   </div>
// );

// // Image count badge component
// const ImageCountBadge = ({ house, hasActiveAccess }) => {
//   const imageCount = house.image_count || (house.images ? house.images.length : 0);

//   if (!hasActiveAccess || !imageCount || imageCount <= 1) return null;

//   return (
//     <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
//       <Camera className="w-3 h-3 mr-1" />
//       {imageCount}
//     </div>
//   );
// };

// // Updated HouseCard component
// const HouseCard = ({
//   house,
//   isSubscribed,
//   subscriptionStatus,
//   daysRemaining = 0,
//   onToggleFavorite,
//   favoriteLoading = false,
//   laravelApiBase
// }) => {
//   const router = useRouter();

//   const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

//   const handleBook = (id) => {
//     if (isSubscribed && id) {
//       router.push(`/properties/${id}`);
//     }
//   };

//   const handleImageError = (e, house) => {
//     const baseUrl = laravelApiBase || 'http://localhost:8000';

//     if (e.target.src.startsWith('data:image/svg+xml')) {
//       return;
//     }

//     const originalPath = house.image;
//     const filename = originalPath && originalPath.includes('/') ?
//       originalPath.split('/').pop() :
//       originalPath;

//     const fallbackPaths = [
//       originalPath && originalPath.startsWith('http') ? originalPath : `${baseUrl}/${originalPath}`,
//       `${baseUrl}/storage/${originalPath}`,
//       filename ? `${baseUrl}/storage/property-images/${filename}` : null,
//       filename ? `${baseUrl}/property-images/${filename}` : null,
//       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4="
//     ].filter(Boolean);

//     const currentSrc = e.target.src;
//     let nextFallbackIndex = 0;

//     for (let i = 0; i < fallbackPaths.length; i++) {
//       if (currentSrc.includes(fallbackPaths[i]) || currentSrc === fallbackPaths[i]) {
//         nextFallbackIndex = i + 1;
//         break;
//       }
//     }

//     if (nextFallbackIndex < fallbackPaths.length) {
//       e.target.src = fallbackPaths[nextFallbackIndex];
//     } else {
//       e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
//     }
//   };

//   const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

//   const getSubscriptionMessage = () => {
//     if (!isSubscribed) return "Subscribe to unlock";
//     if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
//     if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
//     if (subscriptionStatus === 'canceled') return "Subscription canceled";
//     return "Subscribe to unlock";
//   };

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

//   const isPlaceholderImage = house.image && house.image.startsWith('data:image/svg+xml');

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative">
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

//         {hasActiveAccess && !house.hasRealImage && (
//           <div className="absolute top-2 left-2 bg-gray-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
//             <Camera className="w-3 h-3 mr-1" />
//             No Photo
//           </div>
//         )}

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

//         {!hasActiveAccess && (
//           <div className="absolute top-2 right-2 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//             {statusLoading ? '...' : 'LOCKED'}
//           </div>
//         )}

//         {house.hasRealImage && <ImageCountBadge house={house} hasActiveAccess={hasActiveAccess} />}

//         {/* Updated Favorite Button */}
//         <button
//           onClick={() => hasActiveAccess && onToggleFavorite && onToggleFavorite(house.id, house.isFavorite)}
//           disabled={!hasActiveAccess || favoriteLoading}
//           className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
//             hasActiveAccess
//               ? 'bg-white/90 hover:bg-white'
//               : 'bg-gray-500/50 cursor-not-allowed'
//           }`}
//         >
//           {favoriteLoading ? (
//             <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
//           ) : (
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 !hasActiveAccess
//                   ? "text-gray-300"
//                   : house.isFavorite
//                   ? "text-red-500 fill-current"
//                   : "text-gray-600 hover:text-red-400"
//               }`}
//             />
//           )}
//         </button>

//         {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
//           <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
//             {daysRemaining} days left
//           </div>
//         )}

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
// export { PropertyListContainer };






"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Star, Calendar, Lock, Clock, Home, AlertCircle, RefreshCw, Camera, Database, Wifi, WifiOff, MessageCircle, Loader2 } from "lucide-react";
import StatusBadge from "../properties-section/StatusBadge";
import usePropertyStatus from "../properties-section/hooks/usePropertyStatus";
import FallbackImageSVG from './fallback-image-svg';
import axios from '@/lib/axios';

// Main container component that handles data fetching
const PropertyListContainer = ({
  userLocation,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0
}) => {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    if (cleanPath.startsWith('storage/')) {
      return `${LARAVEL_API_BASE}/${cleanPath}`;
    }

    if (cleanPath.includes('property-images/')) {
      return `${LARAVEL_API_BASE}/storage/${cleanPath}`;
    }

    return `${LARAVEL_API_BASE}/storage/property-images/${cleanPath}`;
  };

  const processImageArray = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => getImageUrl(img)).filter(Boolean);
  };

  const cleanLocationForBackend = (locationString) => {
    if (!locationString || typeof locationString !== 'string') return '';

    const trimmed = locationString.trim();
    const cityOnly = trimmed.split(',')[0].trim();

    return cityOnly;
  };

  const fetchPropertiesByLocation = async (location, strategy = 'basic') => {
    const cleanedLocation = cleanLocationForBackend(location);

    if (!cleanedLocation) {
      throw new Error('INVALID_LOCATION');
    }

    const timestamp = new Date().getTime();

    let apiUrl;
    if (strategy === 'advanced') {
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location-advanced?location=${encodeURIComponent(cleanedLocation)}&fallback=random&limit=20&t=${timestamp}`;
    } else {
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location?location=${encodeURIComponent(cleanedLocation)}&limit=20&t=${timestamp}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();
    return data.properties || data || [];
  };

  const fetchAllProperties = async () => {
    const timestamp = new Date().getTime();
    const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/all?t=${timestamp}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    return await response.json();
  };

  // Updated favorite toggle function
  const handleToggleFavorite = async (propertyId, currentFavoriteState) => {
    if (favoriteLoading[propertyId]) return;

    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    // Optimistic UI update
    const newFavoriteState = !currentFavoriteState;
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.id === propertyId
          ? { ...property, isFavorite: newFavoriteState }
          : property
      )
    );

    try {
      const response = await axios.post('/api/favorites/toggle', {
        property_id: propertyId
      });

      // Update with actual server state
      const { is_favorited } = response.data.data;
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.id === propertyId
            ? { ...property, isFavorite: is_favorited }
            : property
        )
      );

    } catch (error) {
      // Revert optimistic update on error
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.id === propertyId
            ? { ...property, isFavorite: currentFavoriteState }
            : property
        )
      );

      if (error.response?.status === 419) {
        alert("Session expired. Please refresh the page and try again.");
      } else if (error.response?.status === 401) {
        alert("Please log in to add favorites.");
      } else {
        alert("Failed to update favorite. Please try again.");
      }
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  // Main data fetching function
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let propertiesData = [];

        if (userLocation && userLocation.trim()) {
          const cleanedUserLocation = cleanLocationForBackend(userLocation);

          if (cleanedUserLocation) {
            try {
              propertiesData = await fetchPropertiesByLocation(userLocation, 'basic');
            } catch (locationError) {
              propertiesData = await fetchAllProperties();
            }
          } else {
            propertiesData = await fetchAllProperties();
          }
        } else {
          propertiesData = await fetchAllProperties();
        }

        if (!Array.isArray(propertiesData)) {
          throw new Error('INVALID_DATA_FORMAT');
        }

        const placeholderImage = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=`;

        const validatedProperties = propertiesData.map(property => {
          const primaryImage = property.image || property.featured_image ||
                             (property.images && property.images[0]);
          const allImages = property.images || (primaryImage ? [primaryImage] : []);
          const fullImageUrl = getImageUrl(primaryImage);
          const processedImages = processImageArray(allImages);

          return {
            ...property,
            id: property.id || `temp_${Date.now()}_${Math.random()}`,
            title: property.title || property.name || 'Untitled Property',
            price: property.price || property.rent || 'Price not available',
            location: property.location || property.address || property.city || 'Location not specified',
            image: fullImageUrl || placeholderImage,
            images: processedImages.length > 0 ? processedImages : [placeholderImage],
            image_count: property.image_count || (processedImages.length > 0 ? processedImages.length : 1),
            hasRealImage: !!fullImageUrl,
            status: property.status || property.current_status || 'available',
            rating: property.rating || property.average_rating || null,
            isFavorite: property.isFavorite || property.is_favorite || false
          };
        });

        setProperties(validatedProperties);

        try {
          const timestamp = new Date().getTime();
          const locationsUrl = `${LARAVEL_API_BASE}/api/tenant/properties/locations?t=${timestamp}`;

          const locationsResponse = await fetch(locationsUrl, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json();
            setLocations(Array.isArray(locationsData) ? locationsData : []);
          }
        } catch (locationsError) {
          setLocations([]);
        }

      } catch (err) {
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount, LARAVEL_API_BASE, userLocation]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const sortPropertiesByLocation = (properties, userLocation) => {
    if (!userLocation || !properties.length) return properties;

    const cleanedUserLocation = cleanLocationForBackend(userLocation);
    const userLocationLower = cleanedUserLocation.toLowerCase();

    const userLocationProperties = [];
    const partialMatchProperties = [];
    const otherLocationProperties = [];

    properties.forEach(property => {
      const locationFields = [
        property.location,
        property.city,
        property.address,
        property.area,
        property.neighborhood
      ].filter(Boolean);

      const exactMatch = locationFields.some(field => {
        if (!field) return false;
        const cleanedField = cleanLocationForBackend(field).toLowerCase();
        return cleanedField === userLocationLower;
      });

      const partialMatch = locationFields.some(field => {
        if (!field) return false;
        const cleanedField = cleanLocationForBackend(field).toLowerCase();
        return cleanedField.includes(userLocationLower) || userLocationLower.includes(cleanedField);
      });

      if (exactMatch) {
        userLocationProperties.push(property);
      } else if (partialMatch) {
        partialMatchProperties.push(property);
      } else {
        otherLocationProperties.push(property);
      }
    });

    return [...userLocationProperties, ...partialMatchProperties, ...otherLocationProperties];
  };

  const sortedProperties = sortPropertiesByLocation(properties, userLocation);

  const renderError = (errorType) => {
    const errorConfigs = {
      'API_NOT_FOUND': {
        icon: <Database className="w-12 h-12 text-red-400" />,
        title: 'Service Unavailable',
        message: 'The property listing service is currently unavailable.',
        suggestion: 'Ensure your Laravel server is running.',
        color: 'red'
      },
      'HTTP_401': {
        icon: <Lock className="w-12 h-12 text-red-400" />,
        title: 'Authentication Required',
        message: 'You need to be authenticated to access property listings.',
        suggestion: 'Please log in to your account and try again.',
        color: 'red'
      },
      'HTTP_500': {
        icon: <AlertCircle className="w-12 h-12 text-orange-400" />,
        title: 'Server Error',
        message: 'The server encountered an error while processing your request.',
        suggestion: 'This is usually temporary. Please try again.',
        color: 'orange'
      },
      'HTTP_403': {
        icon: <Lock className="w-12 h-12 text-purple-400" />,
        title: 'Access Denied',
        message: 'You do not have permission to access property listings.',
        suggestion: 'Please check your authentication credentials.',
        color: 'purple'
      },
      'NETWORK_ERROR': {
        icon: <WifiOff className="w-12 h-12 text-gray-400" />,
        title: 'Connection Error',
        message: 'Unable to connect to the server.',
        suggestion: 'Verify the backend server is running and your network connection is stable.',
        color: 'gray'
      },
      'INVALID_DATA_FORMAT': {
        icon: <Database className="w-12 h-12 text-yellow-400" />,
        title: 'Data Format Error',
        message: 'The server returned data in an unexpected format.',
        suggestion: 'This indicates a server-side issue.',
        color: 'yellow'
      },
      'UNKNOWN_ERROR': {
        icon: <AlertCircle className="w-12 h-12 text-red-400" />,
        title: 'Unexpected Error',
        message: 'An unexpected error occurred while loading properties.',
        suggestion: 'Please try refreshing the page.',
        color: 'red'
      }
    };

    const config = errorConfigs[errorType] || errorConfigs['UNKNOWN_ERROR'];

    return (
      <div className="text-center py-16">
        <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-xl p-8 max-w-lg mx-auto`}>
          <div className="flex flex-col items-center">
            {config.icon}
            <h3 className={`text-${config.color}-800 font-bold text-xl mt-4 mb-2`}>
              {config.title}
            </h3>
            <p className={`text-${config.color}-700 text-sm mb-4 text-center leading-relaxed`}>
              {config.message}
            </p>
            <p className={`text-${config.color}-600 text-xs mb-6 text-center`}>
              {config.suggestion}
            </p>
            <button
              onClick={handleRetry}
              className={`px-6 py-2 bg-${config.color}-600 text-white rounded-lg text-sm hover:bg-${config.color}-700 transition-colors duration-200 flex items-center`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                : 'Fetching properties...'
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
    return renderError(error);
  }

  if (!sortedProperties.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 max-w-md mx-auto">
          <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-700 font-bold text-xl mb-2">No Properties Available</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {userLocation
              ? `No properties found in ${userLocation}.`
              : 'No properties available at the moment.'
            }
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Showing properties for: <strong className="ml-1">{cleanLocationForBackend(userLocation)}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProperties.map((property) => (
          <HouseCard
            key={property.id}
            house={property}
            isSubscribed={isSubscribed}
            subscriptionStatus={subscriptionStatus}
            daysRemaining={daysRemaining}
            onToggleFavorite={handleToggleFavorite}
            favoriteLoading={favoriteLoading[property.id] || false}
            laravelApiBase={LARAVEL_API_BASE}
          />
        ))}
      </div>
    </div>
  );
};

// Loading skeleton component
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-200"></div>
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Image count badge component
const ImageCountBadge = ({ house, hasActiveAccess }) => {
  const imageCount = house.image_count || (house.images ? house.images.length : 0);

  if (!hasActiveAccess || !imageCount || imageCount <= 1) return null;

  return (
    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
      <Camera className="w-3 h-3 mr-1" />
      {imageCount}
    </div>
  );
};

// Updated HouseCard component with card click navigation
const HouseCard = ({
  house,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite,
  favoriteLoading = false,
  laravelApiBase
}) => {
  const router = useRouter();

  const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

  const handleBook = (id) => {
    if (isSubscribed && id) {
      router.push(`/properties/${id}`);
    }
  };

  // Handle card click to navigate to property details
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    const isFavoriteButton = e.target.closest('[data-favorite-button]');
    const isButton = e.target.closest('button');

    // Only prevent if clicking the favorite button
    if (isFavoriteButton) {
      return;
    }

    // Allow action button to also navigate
    if (isButton && !isFavoriteButton) {
      return; // Let button handle its own navigation
    }

    // Navigate to property details if has access
    if (hasActiveAccess && house.id) {
      router.push(`/properties/${house.id}`);
    }
  };

  const handleImageError = (e, house) => {
    const baseUrl = laravelApiBase || 'http://localhost:8000';

    if (e.target.src.startsWith('data:image/svg+xml')) {
      return;
    }

    const originalPath = house.image;
    const filename = originalPath && originalPath.includes('/') ?
      originalPath.split('/').pop() :
      originalPath;

    const fallbackPaths = [
      originalPath && originalPath.startsWith('http') ? originalPath : `${baseUrl}/${originalPath}`,
      `${baseUrl}/storage/${originalPath}`,
      filename ? `${baseUrl}/storage/property-images/${filename}` : null,
      filename ? `${baseUrl}/property-images/${filename}` : null,
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4="
    ].filter(Boolean);

    const currentSrc = e.target.src;
    let nextFallbackIndex = 0;

    for (let i = 0; i < fallbackPaths.length; i++) {
      if (currentSrc.includes(fallbackPaths[i]) || currentSrc === fallbackPaths[i]) {
        nextFallbackIndex = i + 1;
        break;
      }
    }

    if (nextFallbackIndex < fallbackPaths.length) {
      e.target.src = fallbackPaths[nextFallbackIndex];
    } else {
      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
    }
  };

  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

  const getSubscriptionMessage = () => {
    if (!isSubscribed) return "Subscribe to unlock";
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
    if (subscriptionStatus === 'canceled') return "Subscription canceled";
    return "Subscribe to unlock";
  };

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

  const isPlaceholderImage = house.image && house.image.startsWith('data:image/svg+xml');

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative ${
        hasActiveAccess ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      onClick={handleCardClick}
    >
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

        {hasActiveAccess && !house.hasRealImage && (
          <div className="absolute top-2 left-2 bg-gray-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Camera className="w-3 h-3 mr-1" />
            No Photo
          </div>
        )}

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

        {!hasActiveAccess && (
          <div className="absolute top-2 right-2 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {statusLoading ? '...' : 'LOCKED'}
          </div>
        )}

        {house.hasRealImage && <ImageCountBadge house={house} hasActiveAccess={hasActiveAccess} />}

        {/* Favorite Button with data attribute to prevent card navigation */}
        <button
          data-favorite-button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            hasActiveAccess && onToggleFavorite && onToggleFavorite(house.id, house.isFavorite);
          }}
          disabled={!hasActiveAccess || favoriteLoading}
          className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
            hasActiveAccess
              ? 'bg-white/90 hover:bg-white'
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
        >
          {favoriteLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            <Heart
              className={`w-5 h-5 transition-colors ${
                !hasActiveAccess
                  ? "text-gray-300"
                  : house.isFavorite
                  ? "text-red-500 fill-current"
                  : "text-gray-600 hover:text-red-400"
              }`}
            />
          )}
        </button>

        {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {daysRemaining} days left
          </div>
        )}

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

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent double navigation
            handleBook(house.id);
          }}
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
export { PropertyListContainer };
