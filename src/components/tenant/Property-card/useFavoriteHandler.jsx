// components/property-card/useFavoriteHandler.js
import { useState } from 'react';

const useFavoriteHandler = (laravelApiBase) => {
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const handleToggleFavorite = async (propertyId, currentFavoriteStatus) => {
    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      // Use the toggle endpoint as per your routes
      const response = await fetch(`${laravelApiBase}/api/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Important for Sanctum authentication
        body: JSON.stringify({
          property_id: propertyId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to toggle favorite`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        newStatus: result.is_favorite // Assuming your API returns this
      };

    } catch (error) {
      console.error('Favorite toggle error:', error);

      // You can add custom error handling here
      // For example, show an alert or update UI state

      return {
        success: false,
        error: error.message
      };

    } finally {
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  // Optional: Check if a property is favorited
  const checkFavoriteStatus = async (propertyId) => {
    try {
      const response = await fetch(`${laravelApiBase}/api/favorites/check/${propertyId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }

      const result = await response.json();
      return result.is_favorite || false;

    } catch (error) {
      console.error('Check favorite error:', error);
      return false;
    }
  };

  return {
    handleToggleFavorite,
    checkFavoriteStatus,
    favoriteLoading,
  };
};

export default useFavoriteHandler;
