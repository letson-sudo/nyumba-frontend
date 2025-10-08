import React, { useState } from "react";
import { Search, Filter, MapPin, ChevronDown, Lock, Clock } from "lucide-react";

const SearchAndFilter = ({
  searchLocation,
  onSearchChange,
  isSubscribed,
  subscriptionStatus = 'none',
  daysRemaining = 0,
  onFilter,
  currentLocation = "Lilongwe, Malawi",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Filter");

  // Determine if features should be active
  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

  const toggleDropdown = () => {
    if (hasActiveAccess) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const filterOptions = ["Location", "Price", "House Type", "Amenities"];

  const handleFilterSelect = (option) => {
    if (hasActiveAccess) {
      setSelectedFilter(option);
      onFilter(option);
      setIsDropdownOpen(false);
    }
  };

  const getSearchPlaceholder = () => {
    if (!isSubscribed) return "Subscribe to search";
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Payment processing...";
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired - Renew to search";
    if (subscriptionStatus === 'canceled') return "Subscription canceled";
    return `Search by ${selectedFilter.toLowerCase()}...`;
  };

  const getLocationText = () => {
    if (!hasActiveAccess) {
      if (!isSubscribed) return "Hidden - Subscribe to view";
      if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Hidden - Payment processing";
      if (subscriptionStatus === 'active' && daysRemaining === 0) return "Hidden - Subscription expired";
      return "Hidden - Subscribe to view";
    }
    return currentLocation;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative">
      {/* Subscription Status Banner */}
      {!hasActiveAccess && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          subscriptionStatus === 'processing' || subscriptionStatus === 'pending'
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : subscriptionStatus === 'active' && daysRemaining === 0
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {subscriptionStatus === 'processing' || subscriptionStatus === 'pending' ? (
              <Clock className="w-4 h-4 mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            <span>
              {subscriptionStatus === 'processing' || subscriptionStatus === 'pending'
                ? 'Payment is being processed. Search will be available once confirmed.'
                : subscriptionStatus === 'active' && daysRemaining === 0
                ? 'Your subscription has expired. Renew to continue searching.'
                : 'Subscribe to unlock search and filter features.'
              }
            </span>
          </div>
        </div>
      )}

      {/* Days Remaining Warning */}
      {hasActiveAccess && daysRemaining <= 7 && daysRemaining > 0 && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-orange-50 text-orange-800 border border-orange-200">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              Your subscription expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.
              Renew to continue access.
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          {!hasActiveAccess && (
            <div className="absolute inset-0 bg-gray-100/50 rounded-lg z-10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Premium Feature</span>
            </div>
          )}
          <Search className={`w-5 h-5 absolute left-3 top-3 ${
            hasActiveAccess ? 'text-gray-400' : 'text-gray-300'
          }`} />
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
              hasActiveAccess
                ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                : 'bg-gray-50 cursor-not-allowed'
            }`}
            value={hasActiveAccess ? searchLocation : ''}
            onChange={(e) => hasActiveAccess && onSearchChange(e.target.value)}
            disabled={!hasActiveAccess}
          />
        </div>

        {/* Filter Dropdown Button */}
        <div className="relative">
          {!hasActiveAccess && (
            <div className="absolute inset-0 bg-gray-100/50 rounded-lg z-10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <button
            onClick={toggleDropdown}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              hasActiveAccess
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!hasActiveAccess}
          >
            <Filter className="w-5 h-5" />
            {selectedFilter}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && hasActiveAccess && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
              <ul className="py-2">
                {filterOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleFilterSelect(option)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Current Location */}
      <div className="flex items-center mt-4 text-sm text-gray-600">
        <MapPin className={`w-4 h-4 mr-2 ${
          hasActiveAccess ? 'text-gray-400' : 'text-gray-300'
        }`} />
        <span className={hasActiveAccess ? 'text-gray-600' : 'text-gray-400'}>
          Current location: {getLocationText()}
        </span>
      </div>

      {/* Feature Status */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        {!hasActiveAccess && (
          <span>
            {subscriptionStatus === 'processing' || subscriptionStatus === 'pending'
              ? 'Search features will activate once payment is confirmed'
              : subscriptionStatus === 'active' && daysRemaining === 0
              ? 'Subscription expired - All search features disabled'
              : 'Premium search features - Subscribe to unlock advanced filtering'
            }
          </span>
        )}
        {hasActiveAccess && daysRemaining <= 3 && daysRemaining > 0 && (
          <span className="text-orange-600">
            Premium access expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
