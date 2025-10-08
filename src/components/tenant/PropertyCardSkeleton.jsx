// components/properties/PropertyCardSkeleton.jsx
import React from 'react';

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

export default PropertyCardSkeleton;
