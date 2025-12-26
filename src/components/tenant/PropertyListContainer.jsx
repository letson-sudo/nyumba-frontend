

"use client";
import React, { useState } from 'react';
import SearchModal from '@/components/tenant/header/SearchModal';
import PropertyListContainer from './PropertyListContainer';

const PropertiesPage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Button */}
      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 flex items-center"
      >
        <Search className="w-4 h-4 mr-2" />
        Search Properties
      </button>

      {/* Property List Container with search support */}
      <PropertyListContainer
        userLocation="Lilongwe, Malawi"
        isSubscribed={true}
        subscriptionStatus="active"
        daysRemaining={30}
        onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
        searchResults={searchResults} // Pass search results here
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default PropertiesPage;
