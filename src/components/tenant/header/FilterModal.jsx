"use client";
import React, { useState } from 'react';
import { X, Filter, DollarSign, Home, MapPin } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, onFilter }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    propertyType: '',
    bedrooms: '',
    location: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[7000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 text-green-600 mr-2" />
            Filter Properties
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                className="w-full"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
              />
              <span className="text-sm">MWK {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={filters.propertyType}
              onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
            >
              <option value="">Any Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                onFilter(filters);
                onClose();
              }}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Apply Filters
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
