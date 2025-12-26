// components/properties/useFavoriteHandler.js
import { useState } from 'react';
import axios from '@/lib/axios'; // Import your custom axios instance

const useFavoriteHandler = (laravelApiBase) => {
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const handleToggleFavorite = async (propertyId, currentFavoriteStatus) => {
    // Set loading state for this specific property
    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      console.log('Sending toggle favorite request:', {
        propertyId,
        currentFavoriteStatus,
        endpoint: '/api/favorites/toggle'
      });

      // Use axios instead of fetch with your custom instance
      const response = await axios.post('/api/favorites/toggle', {
        property_id: propertyId
      });

      console.log('Favorite toggle response:', response.data);

      // Extract data from response
      const { is_favorited, favorite_status, favorite_id } = response.data.data;

      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: true,
        newStatus: is_favorited,
        favoriteStatus: favorite_status,
        favoriteId: favorite_id,
        message: response.data.message
      };

    } catch (error) {
      console.error('Error toggling favorite:', error);
      console.error('Error response:', error.response?.data);

      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: false,
        error: error.response?.data?.message || error.message,
        newStatus: currentFavoriteStatus // Return current status on error
      };
    }
  };

  // Additional method to check favorite status
  const checkFavoriteStatus = async (propertyId) => {
    try {
      const response = await axios.get(`/api/favorites/check/${propertyId}`);

      return {
        success: true,
        is_favorited: response.data.data.is_favorited,
        favorite_status: response.data.data.favorite_status,
        favorite_id: response.data.data.favorite_id
      };
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  };

  // Method to add to favorites
  const addToFavorites = async (propertyId) => {
    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      const response = await axios.post('/api/favorites', {
        property_id: propertyId
      });

      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: true,
        newStatus: true,
        favoriteStatus: 'active',
        favoriteId: response.data.data.favorite_id,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  };

  // Method to remove from favorites
  const removeFromFavorites = async (propertyId) => {
    setFavoriteLoading(prev => ({ ...prev, [propertyId]: true }));

    try {
      const response = await axios.delete(`/api/favorites/${propertyId}`);

      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: true,
        newStatus: false,
        favoriteStatus: 'inactive',
        message: response.data.message
      };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setFavoriteLoading(prev => ({ ...prev, [propertyId]: false }));

      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  };

  return {
    handleToggleFavorite,
    checkFavoriteStatus,
    addToFavorites,
    removeFromFavorites,
    favoriteLoading
  };
};

export default useFavoriteHandler;
