"use client";
import React from "react";
import { MapPin, Star } from "lucide-react";

const PropertyDataDisplay = ({
  house,
  hasActiveAccess,
  getLocationText,
  getSubscriptionMessage
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        {/* Property Title */}
        <h3 className={`font-bold text-lg leading-tight ${
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

      {/* Location */}
      <div className="flex items-center text-gray-600 mb-6">
        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
        <span className={`text-sm font-medium ${
          hasActiveAccess ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {getLocationText()}
        </span>
      </div>

      {/* Additional Property Details */}
      {hasActiveAccess && (
        <div className="space-y-2 mb-4">
          {house.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {house.description}
            </p>
          )}

          {/* Property Features */}
          <div className="flex flex-wrap gap-2">
            {house.bedrooms && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {house.bedrooms} bed{house.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {house.bathrooms && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {house.bathrooms} bath{house.bathrooms !== 1 ? 's' : ''}
              </span>
            )}
            {house.area && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {house.area}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Subscription Info for non-subscribers */}
      {!hasActiveAccess && (
        <div className="mt-3 text-center text-xs text-gray-500">
          {getSubscriptionMessage()}
        </div>
      )}
    </div>
  );
};

export default PropertyDataDisplay;
