// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   MapPin,
//   Phone,
//   User,
//   ArrowLeft,
//   Calendar,
//   Star,
//   Heart,
//   Share2,
//   Camera,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   RefreshCw,
//   AlertCircle,
//   Database,
//   WifiOff,
//   BookOpen,
//   Loader2
// } from "lucide-react";


// import BookingCard from "../../../components/tenant/property-card/BookingCard";

// const PropertyDetailsPage = () => {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);

//   const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

//     const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

//     if (cleanPath.startsWith('storage/')) return `${LARAVEL_API_BASE}/${cleanPath}`;
//     if (cleanPath.includes('property-images/')) return `${LARAVEL_API_BASE}/storage/${cleanPath}`;

//     return `${LARAVEL_API_BASE}/storage/property-images/${cleanPath}`;
//   };

//   const processImageArray = (images) => {
//     if (!Array.isArray(images)) return [];
//     return images.map(img => getImageUrl(img)).filter(Boolean);
//   };

//   useEffect(() => {
//     const fetchPropertyData = async () => {
//       if (!id) return;

//       try {
//         setLoading(true);
//         setError(null);

//         const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/${id}?t=${Date.now()}`;

//         const response = await fetch(apiUrl, {
//           method: 'GET',
//           headers: {
//             'Cache-Control': 'no-cache',
//             'Pragma': 'no-cache',
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           },
//           credentials: 'include'
//         });

//         if (!response.ok) {
//           switch (response.status) {
//             case 404:
//               throw new Error('PROPERTY_NOT_FOUND');
//             case 500:
//               throw new Error('SERVER_ERROR');
//             case 403:
//               throw new Error('ACCESS_DENIED');
//             case 401:
//               throw new Error('UNAUTHORIZED');
//             default:
//               if (!navigator.onLine) throw new Error('NETWORK_ERROR');
//               throw new Error('UNKNOWN_ERROR');
//           }
//         }

//         const propertyData = await response.json();

//         const primaryImage = propertyData.image || propertyData.featured_image || (propertyData.images && propertyData.images[0]);
//         const allImages = propertyData.images || (primaryImage ? [primaryImage] : []);
//         const processedImages = processImageArray(allImages);

//         const processedProperty = {
//           ...propertyData,
//           image: getImageUrl(primaryImage),
//           images: processedImages,
//           image_count: propertyData.image_count || processedImages.length,
//           amenities: propertyData.amenities || propertyData.features || [],
//           status: propertyData.status || propertyData.current_status || 'available',
//           rating: propertyData.rating || propertyData.average_rating || null,
//           isFavorite: propertyData.isFavorite || propertyData.is_favorite || false,
//           title: propertyData.title || propertyData.name || 'Property Details',
//           price: propertyData.price || propertyData.rent || 'Price not available',
//           location: propertyData.location || propertyData.address || propertyData.city || 'Location not specified',
//           description: propertyData.description || propertyData.details || 'No description available',
//           landlord: propertyData.landlord || propertyData.owner || propertyData.landlord_name || 'Contact Info Not Available',
//           phone: propertyData.phone || propertyData.contact || propertyData.landlord_phone || 'Phone not available'
//         };

//         setProperty(processedProperty);
//         setIsFavorite(processedProperty.isFavorite);
//         setCurrentImageIndex(0);
//       } catch (err) {
//         setError(err.message);
//         setProperty(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPropertyData();
//   }, [id, retryCount, LARAVEL_API_BASE]);

//   const nextImage = () => {
//     if (property?.images?.length > 1) {
//       setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
//     }
//   };

//   const prevImage = () => {
//     if (property?.images?.length > 1) {
//       setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
//     }
//   };

//   const handleImageError = (e, imagePath) => {
//     const baseUrl = LARAVEL_API_BASE;
//     const filename = imagePath.includes('/') ? imagePath.split('/').pop() : imagePath;

//     const fallbackPaths = [
//       `${baseUrl}/storage/${imagePath}`,
//       `${baseUrl}/storage/property-images/${filename}`,
//       `${baseUrl}/property-images/${filename}`,
//       `${baseUrl}/images/property-images/${filename}`,
//       'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='
//     ];

//     const currentSrc = e.target.src;
//     let nextFallbackIndex = fallbackPaths.findIndex(path => currentSrc.includes(path)) + 1;

//     if (nextFallbackIndex < fallbackPaths.length) {
//       e.target.src = fallbackPaths[nextFallbackIndex];
//     }
//   };

//   const handleRetry = () => setRetryCount(prev => prev + 1);

//   const handleToggleFavorite = async () => {
//     // optimistic update
//     setIsFavorite(!isFavorite);

//     try {
//       const response = await fetch(`${LARAVEL_API_BASE}/api/tenant/properties/${id}/favorite`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ is_favorite: !isFavorite })
//       });

//       if (!response.ok) setIsFavorite(isFavorite);
//     } catch (err) {
//       setIsFavorite(isFavorite);
//     }
//   };

//   const renderError = (errorType) => {
//     const errorConfigs = {
//       'PROPERTY_NOT_FOUND': {
//         icon: <Database className="w-12 h-12 text-orange-400" />,
//         title: 'Property Not Found',
//         message: 'The requested property could not be found in the database.',
//         suggestion: 'The property may have been removed or the ID is incorrect.',
//         color: 'orange'
//       },
//       'UNAUTHORIZED': {
//         icon: <AlertCircle className="w-12 h-12 text-red-400" />,
//         title: 'Access Denied',
//         message: 'You need to be authenticated to view property details.',
//         suggestion: 'Please log in to your account and try again.',
//         color: 'red'
//       },
//       'SERVER_ERROR': {
//         icon: <AlertCircle className="w-12 h-12 text-red-400" />,
//         title: 'Server Error',
//         message: 'The server encountered an error while loading this property.',
//         suggestion: 'This is usually temporary. Please try again in a moment.',
//         color: 'red'
//       },
//       'NETWORK_ERROR': {
//         icon: <WifiOff className="w-12 h-12 text-gray-400" />,
//         title: 'Connection Error',
//         message: 'Unable to connect to the server to load property details.',
//         suggestion: 'Check your internet connection and try again.',
//         color: 'gray'
//       }
//     };

//     const config = errorConfigs[errorType] || errorConfigs['SERVER_ERROR'];

//     return (
//       <div className="max-w-5xl mx-auto p-6">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Properties
//         </button>

//         <div className="text-center py-16">
//           <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-xl p-8 max-w-lg mx-auto`}>
//             <div className="flex flex-col items-center">
//               {config.icon}
//               <h3 className={`text-${config.color}-800 font-bold text-xl mt-4 mb-2`}>
//                 {config.title}
//               </h3>
//               <p className={`text-${config.color}-700 text-sm mb-4 text-center leading-relaxed`}>
//                 {config.message}
//               </p>
//               <p className={`text-${config.color}-600 text-xs mb-6 text-center`}>
//                 {config.suggestion}
//               </p>
//               <div className="space-y-3">
//                 <button
//                   onClick={handleRetry}
//                   className={`px-6 py-2 bg-${config.color}-600 text-white rounded-lg text-sm hover:bg-${config.color}-700 transition-colors duration-200 flex items-center`}
//                 >
//                   <RefreshCw className="w-4 h-4 mr-2" />
//                   Try Again
//                 </button>
//                 <button
//                   onClick={() => router.back()}
//                   className="px-6 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors duration-200"
//                 >
//                   Go Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto p-6">
//         <div className="flex items-center justify-center py-20">
//           <div className="text-center">
//             <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
//             <p className="text-gray-700 text-base font-medium">Loading Property Details</p>
//             <p className="text-gray-500 text-sm mt-1">Fetching from Laravel backend...</p>
//             <p className="text-gray-400 text-xs mt-1">{LARAVEL_API_BASE}/api/tenant/properties/{id}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) return renderError(error);
//   if (!property) return renderError('PROPERTY_NOT_FOUND');

//   const hasImages = property.images && property.images.length > 0;
//   const currentImage = hasImages ? property.images[currentImageIndex] : null;
//   const isPropertyUnavailable = property.status !== 'available';

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       {/* Header with Back Button */}
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Properties
//         </button>

//         <div className="flex items-center space-x-3">
//           <button
//             onClick={handleToggleFavorite}
//             className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500 hover:text-red-400'}`}
//           >
//             <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
//           </button>
//           <button className="p-2 rounded-full bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors">
//             <Share2 className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Image Gallery Section */}
//       <div className="relative mb-8 bg-gray-100 rounded-xl overflow-hidden">
//         {hasImages ? (
//           <>
//             <div className="relative h-96 bg-gray-200">
//               <img
//                 src={currentImage}
//                 alt={`Property ${currentImageIndex + 1}`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => handleImageError(e, currentImage)}
//               />

//               {/* Image Counter */}
//               <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
//                 <Camera className="w-4 h-4 mr-1" />
//                 {currentImageIndex + 1} / {property.images.length}
//               </div>

//               {/* Navigation Arrows */}
//               {property.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
//                   >
//                     <ChevronLeft className="w-6 h-6" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
//                   >
//                     <ChevronRight className="w-6 h-6" />
//                   </button>
//                 </>
//               )}

//               {/* View All Images Button */}
//               <button
//                 onClick={() => setShowImageModal(true)}
//                 className="absolute bottom-4 left-4 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center"
//               >
//                 <BookOpen className="w-4 h-4 mr-2" />
//                 View All Photos
//               </button>
//             </div>

//             {/* Thumbnail Navigation */}
//             {property.images.length > 1 && (
//               <div className="flex space-x-2 p-4 overflow-x-auto">
//                 {property.images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
//                   >
//                     <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" onError={(e) => handleImageError(e, img)} />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="h-96 flex items-center justify-center bg-gray-200">
//             <div className="text-center">
//               <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 font-medium">No Images Available</p>
//               <p className="text-gray-500 text-sm">Photos will be added soon</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Property Information */}
//       <div className="grid md:grid-cols-3 gap-8">
//         {/* Main Content */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Title and Status */}
//           <div>
//             {/* <div className="flex items-start justify-between mb-2">
//               <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
//               <StatusBadge status={property.status} />
//             </div> */}

//             <div className="flex items-center text-gray-600 mb-4">
//               <MapPin className="w-5 h-5 mr-2" />
//               <span className="text-lg">{property.location}</span>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="text-3xl font-bold text-blue-600">
//                 MKW {typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
//                 <span className="text-lg text-gray-600 font-normal">/month</span>
//               </div>

//               {property.rating && (
//                 <div className="flex items-center">
//                   <Star className="w-5 h-5 text-yellow-400 fill-current" />
//                   <span className="ml-1 font-medium">{property.rating}</span>
//                   <span className="ml-1 text-gray-500 text-sm">(Reviews)</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{property.description}</p>
//           </div>

//           {/* Amenities */}
//           {property.amenities && property.amenities.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {property.amenities.map((amenity, index) => (
//                   <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                     <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
//                     <span className="text-gray-700 text-sm">{amenity}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Booking Card (imported) */}
//           <BookingCard property={property} propertyId={id} apiBase={LARAVEL_API_BASE} />

//           {/* Landlord Contact */}
//           <div className="bg-gray-50 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Landlord</h3>

//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <User className="w-5 h-5 text-gray-500 mr-3" />
//                 <span className="text-gray-700">{property.landlord}</span>
//               </div>

//               <div className="flex items-center">
//                 <Phone className="w-5 h-5 text-gray-500 mr-3" />
//                 <span className="text-gray-700">{property.phone}</span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Call Landlord
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Modal */}
//       {showImageModal && hasImages && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
//           <div className="relative max-w-4xl w-full">
//             <button onClick={() => setShowImageModal(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
//               <X className="w-8 h-8" />
//             </button>

//             <div className="bg-white rounded-lg overflow-hidden">
//               <img src={property.images[currentImageIndex]} alt={`Property ${currentImageIndex + 1}`} className="w-full h-auto max-h-[70vh] object-contain" onError={(e) => handleImageError(e, property.images[currentImageIndex])} />

//               {property.images.length > 1 && (
//                 <div className="p-4 bg-gray-100">
//                   <div className="flex items-center justify-between">
//                     <button onClick={prevImage} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                       <ChevronLeft className="w-5 h-5 mr-1" />
//                       Previous
//                     </button>

//                     <span className="text-gray-600">{currentImageIndex + 1} of {property.images.length}</span>

//                     <button onClick={nextImage} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                       Next
//                       <ChevronRight className="w-5 h-5 ml-1" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetailsPage;


"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  RefreshCw,
  AlertCircle,
  Database,
  WifiOff
} from "lucide-react";

import PropertyDetailsCard from "../../../components/tenant/PropertyDetailsCard";
import LandlordContactCard from "../../../components/tenant/LandlordContactCard";
import PropertyBookingCard from "../../../components/tenant/PropertyBookingCard";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const LARAVEL_API_BASE =
    process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;

    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

    if (cleanPath.startsWith("storage/"))
      return `${LARAVEL_API_BASE}/${cleanPath}`;
    if (cleanPath.includes("property-images/"))
      return `${LARAVEL_API_BASE}/storage/${cleanPath}`;

    return `${LARAVEL_API_BASE}/storage/property-images/${cleanPath}`;
  };

  const processImageArray = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map((img) => getImageUrl(img)).filter(Boolean);
  };

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/${id}?t=${Date.now()}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          switch (response.status) {
            case 404:
              throw new Error("PROPERTY_NOT_FOUND");
            case 500:
              throw new Error("SERVER_ERROR");
            case 403:
              throw new Error("ACCESS_DENIED");
            case 401:
              throw new Error("UNAUTHORIZED");
            default:
              if (!navigator.onLine) throw new Error("NETWORK_ERROR");
              throw new Error("UNKNOWN_ERROR");
          }
        }

        const propertyData = await response.json();

        const primaryImage =
          propertyData.image ||
          propertyData.featured_image ||
          (propertyData.images && propertyData.images[0]);
        const allImages =
          propertyData.images || (primaryImage ? [primaryImage] : []);
        const processedImages = processImageArray(allImages);

        const processedProperty = {
          ...propertyData,
          image: getImageUrl(primaryImage),
          images: processedImages,
          image_count: propertyData.image_count || processedImages.length,
          amenities: propertyData.amenities || propertyData.features || [],
          status: propertyData.status || propertyData.current_status || "available",
          rating: propertyData.rating || propertyData.average_rating || null,
          isFavorite: propertyData.isFavorite || propertyData.is_favorite || false,
          title: propertyData.title || propertyData.name || "Property Details",
          price: propertyData.price || propertyData.rent || 0,
          location:
            propertyData.location ||
            propertyData.address ||
            propertyData.city ||
            "Location not specified",
          description:
            propertyData.description ||
            propertyData.details ||
            "No description available",
          landlord:
            propertyData.landlord ||
            propertyData.owner ||
            propertyData.landlord_name ||
            "Contact Info Not Available",
          phone:
            propertyData.phone ||
            propertyData.contact ||
            propertyData.landlord_phone ||
            "Phone not available",
          email: propertyData.email || propertyData.landlord_email || null,
          bedrooms: propertyData.bedrooms || null,
          bathrooms: propertyData.bathrooms || null,
          area: propertyData.area || null
        };

        setProperty(processedProperty);
        setIsFavorite(processedProperty.isFavorite);
      } catch (err) {
        setError(err.message);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id, retryCount, LARAVEL_API_BASE]);

  const handleImageError = (e, imagePath) => {
    const baseUrl = LARAVEL_API_BASE;
    const filename = imagePath.includes("/")
      ? imagePath.split("/").pop()
      : imagePath;

    const fallbackPaths = [
      `${baseUrl}/storage/${imagePath}`,
      `${baseUrl}/storage/property-images/${filename}`,
      `${baseUrl}/property-images/${filename}`,
      `${baseUrl}/images/property-images/${filename}`,
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4="
    ];

    const currentSrc = e.target.src;
    let nextFallbackIndex =
      fallbackPaths.findIndex((path) => currentSrc.includes(path)) + 1;

    if (nextFallbackIndex < fallbackPaths.length) {
      e.target.src = fallbackPaths[nextFallbackIndex];
    }
  };

  const handleRetry = () => setRetryCount((prev) => prev + 1);

  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch(
        `${LARAVEL_API_BASE}/api/tenant/properties/${id}/favorite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_favorite: !isFavorite })
        }
      );

      if (!response.ok) setIsFavorite(isFavorite);
    } catch {
      setIsFavorite(isFavorite);
    }
  };

  const renderError = (errorType) => {
    const errorConfigs = {
      PROPERTY_NOT_FOUND: {
        icon: <Database className="w-12 h-12 text-orange-400" />,
        title: "Property Not Found",
        message: "The requested property could not be found in the database.",
        suggestion:
          "The property may have been removed or the ID is incorrect.",
        color: "orange"
      },
      UNAUTHORIZED: {
        icon: <AlertCircle className="w-12 h-12 text-red-400" />,
        title: "Access Denied",
        message: "You need to be authenticated to view property details.",
        suggestion: "Please log in to your account and try again.",
        color: "red"
      },
      SERVER_ERROR: {
        icon: <AlertCircle className="w-12 h-12 text-red-400" />,
        title: "Server Error",
        message: "The server encountered an error while loading this property.",
        suggestion: "This is usually temporary. Please try again in a moment.",
        color: "red"
      },
      NETWORK_ERROR: {
        icon: <WifiOff className="w-12 h-12 text-gray-400" />,
        title: "Connection Error",
        message: "Unable to connect to the server to load property details.",
        suggestion: "Check your internet connection and try again.",
        color: "gray"
      }
    };

    const config = errorConfigs[errorType] || errorConfigs.SERVER_ERROR;

    return (
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Properties
        </button>

        <div className="text-center py-16">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-lg mx-auto shadow-lg">
            <div className="flex flex-col items-center">
              {config.icon}
              <h3 className="text-gray-900 font-bold text-2xl mt-4 mb-2">
                {config.title}
              </h3>
              <p className="text-gray-600 text-base mb-4 text-center leading-relaxed">
                {config.message}
              </p>
              <p className="text-gray-500 text-sm mb-6 text-center">
                {config.suggestion}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-gray-800 text-xl font-bold">
              Loading Property Details
            </p>
            <p className="text-gray-500 text-base mt-2">
              Fetching from Laravel backend...
            </p>
            <p className="text-gray-400 text-xs mt-2 font-mono">
              {LARAVEL_API_BASE}/api/tenant/properties/{id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) return renderError(error);
  if (!property) return renderError("PROPERTY_NOT_FOUND");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all transform hover:scale-105 bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-xl transition-all transform hover:scale-110 shadow-md hover:shadow-lg ${
                isFavorite
                  ? "bg-red-50 text-red-500 ring-2 ring-red-200"
                  : "bg-white text-gray-500 hover:text-red-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 rounded-xl bg-white text-gray-500 hover:text-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-110">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1 - Property Details */}
          <div className="lg:col-span-1">
            <PropertyDetailsCard property={property} onImageError={handleImageError} />
          </div>

          {/* Column 2 - Landlord Contact Card */}
          <div className="lg:col-span-1">
            <LandlordContactCard property={property} />
          </div>

          {/* Column 3 - Booking Card */}
          <div className="lg:col-span-1">
            <PropertyBookingCard
              property={property}
              propertyId={id}
              apiBase={LARAVEL_API_BASE}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;

