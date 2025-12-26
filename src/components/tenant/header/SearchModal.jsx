"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, MapPin, DollarSign, Home, Filter, Loader2 } from 'lucide-react';
import axios from '@/lib/axios'; // Import from @/lib/axios like in AddPropertyForm

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    min_price: '',
    max_price: ''
  });
  const [filters, setFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({}); // Changed to object to match AddPropertyForm pattern

  // Fetch available filters
  useEffect(() => {
    if (isOpen) {
      fetchFilters();
    }
  }, [isOpen]);

  const fetchFilters = async () => {
    try {
      const response = await axios.get('/api/search/filters');
      if (response.data?.status === 'success') {
        setFilters(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch filters:', error);
      setErrors({ general: ['Failed to load filters'] });
    }
  };

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('/api/search/quick', {
        params: { q: query }
      });

      if (response.data?.status === 'success') {
        setSuggestions(response.data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Handle input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(searchData.location);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchData.location, fetchSuggestions]);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: null }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchData(prev => ({
      ...prev,
      location: suggestion
    }));
    setSuggestions([]);
  };

  const handleSearch = async (event) => {
    if (event) event.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      // Remove empty fields from search
      const searchParams = Object.fromEntries(
        Object.entries(searchData).filter(([_, value]) => value !== '')
      );

      const response = await axios.get('/api/search/properties', {
        params: searchParams
      });

      if (response.data?.status === 'success') {
        // Pass both properties and search criteria to parent
        onSearch({
          properties: response.data.data.properties,
          searchCriteria: searchParams,
          pagination: response.data.data.pagination
        });
        onClose();
      } else {
        setErrors({ general: [response.data?.message || 'Search failed'] });
      }
    } catch (error) {
      console.error('Search error:', error);

      // Enhanced error handling like in AddPropertyForm
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || { general: ['Invalid search parameters'] });
      } else if (error.response?.status === 404) {
        setErrors({ general: ['Search service not available'] });
      } else if (error.response?.status === 500) {
        setErrors({ general: ['Server error. Please try again later.'] });
      } else {
        setErrors({ general: ['Failed to search properties. Please try again.'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchData({
      location: '',
      min_price: '',
      max_price: ''
    });
    setErrors({});
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[7000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold flex items-center">
            <Search className="w-5 h-5 text-blue-600 mr-2" />
            Search Properties
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Error Display - matches AddPropertyForm pattern */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {Array.isArray(errors.general) ? (
                errors.general.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">
                    {error}
                  </p>
                ))
              ) : (
                <p className="text-red-600 text-sm">{errors.general}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSearch}>
            {/* Quick Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Location
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location, area, or address..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {suggestion}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.location && (
                <div className="mt-2 text-red-500 text-sm">
                  {Array.isArray(errors.location) ? errors.location[0] : errors.location}
                </div>
              )}
            </div>

            {/* Advanced Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide Price Filters' : 'Show Price Filters'}
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="space-y-4 border-t pt-4">
                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price (MWK)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        placeholder={`Min: ${filters.min_price || 0}`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchData.min_price}
                        onChange={(e) => handleInputChange('min_price', e.target.value)}
                      />
                    </div>
                    {errors.min_price && (
                      <div className="mt-2 text-red-500 text-sm">
                        {Array.isArray(errors.min_price) ? errors.min_price[0] : errors.min_price}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price (MWK)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        placeholder={`Max: ${filters.max_price || 1000000}`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchData.max_price}
                        onChange={(e) => handleInputChange('max_price', e.target.value)}
                      />
                    </div>
                    {errors.max_price && (
                      <div className="mt-2 text-red-500 text-sm">
                        {Array.isArray(errors.max_price) ? errors.max_price[0] : errors.max_price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <div className="flex gap-3 flex-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search Properties'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
