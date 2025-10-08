import React, { useState } from "react";
import {
  MapPin,
  Star,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  CheckCircle,
  Home,
  Bed,
  Bath,
  Maximize,
  Sparkles
} from "lucide-react";

const PropertyDetailsCard = ({ property, onImageError }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const hasImages = property?.images && property.images.length > 0;
  const currentImage = hasImages ? property.images[currentImageIndex] : null;

  const nextImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
    }
  };

  if (!property) return null;

  return (
    <>
      {/* Property Details Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
        {/* Compact Image Gallery */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800">
          {hasImages ? (
            <>
              <div className="relative h-[280px] overflow-hidden group">
                <img
                  src={currentImage}
                  alt={`Property ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => onImageError?.(e, currentImage)}
                />

                {/* Elegant Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating Image Counter */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
                  <Camera className="w-3.5 h-3.5" />
                  {currentImageIndex + 1}/{property.images.length}
                </div>

                {/* Premium Status Badge */}
                {property.status && (
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl shadow-xl border-2 ${
                    property.status === 'available'
                      ? 'bg-emerald-500/95 text-white border-emerald-300'
                      : 'bg-amber-500/95 text-white border-amber-300'
                  }`}>
                    ✦ {property.status.toUpperCase()}
                  </div>
                )}

                {/* Sleek Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* View Gallery Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-all flex items-center gap-2 shadow-xl transform hover:scale-105"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Gallery
                </button>
              </div>

              {/* Mini Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {property.images.slice(0, 5).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? 'ring-2 ring-blue-500 scale-110 shadow-lg'
                            : 'ring-1 ring-gray-300 hover:ring-blue-300 hover:scale-105'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumb ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => onImageError?.(e, img)}
                        />
                      </button>
                    ))}
                    {property.images.length > 5 && (
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-all font-bold text-xs"
                      >
                        +{property.images.length - 5}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">No Images</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Info Section */}
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
            {property.title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MKW {typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">per month</div>
            </div>

            {property.rating && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900 text-sm">{property.rating}</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {(property.bedrooms || property.bathrooms || property.area) && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {property.bedrooms && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-100 hover:shadow-md transition-all">
                  <Bed className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-xs text-gray-600 font-medium">Beds</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-3 text-center border border-teal-100 hover:shadow-md transition-all">
                  <Bath className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-xs text-gray-600 font-medium">Baths</div>
                </div>
              )}
              {property.area && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-100 hover:shadow-md transition-all">
                  <Maximize className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{property.area}</div>
                  <div className="text-xs text-gray-600 font-medium">sq ft</div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              Description
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
              {property.description}
            </p>
          </div>

          {/* Amenities Compact */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Key Features
              </h2>
              <div className="space-y-2">
                {property.amenities.slice(0, 4).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 hover:shadow-sm transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium text-xs">{amenity}</span>
                  </div>
                ))}
                {property.amenities.length > 4 && (
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-2"
                  >
                    + {property.amenities.length - 4} more amenities
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && hasImages && (
        <div className="fixed inset-0 bg-black/97 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-7xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-14 right-0 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all transform hover:scale-110 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={property.images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain bg-gray-900"
                onError={(e) => onImageError?.(e, property.images[currentImageIndex])}
              />

              {property.images.length > 1 && (
                <div className="p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    <button
                      onClick={prevImage}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transform hover:scale-105"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Prev
                    </button>

                    <div className="text-center">
                      <div className="text-gray-900 font-bold text-lg">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Property Photos</div>
                    </div>

                    <button
                      onClick={nextImage}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transform hover:scale-105"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetailsCard;
