// updated house card to show properties regardless whether they have img nor not

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Star, Calendar, Lock, Clock, Home, AlertCircle, RefreshCw, Camera, Database, Wifi, WifiOff, MessageCircle } from "lucide-react";
import StatusBadge from "../properties-section/StatusBadge";
import usePropertyStatus from "../properties-section/hooks/usePropertyStatus";
import FallbackImageSVG from './fallback-image-svg';

// Main container component that handles data fetching
const PropertyListContainer = ({
  userLocation,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite
}) => {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [locationStrategy, setLocationStrategy] = useState('basic'); // 'basic' or 'advanced'
  const [fallbackStrategy, setFallbackStrategy] = useState('random'); // 'random', 'popular', 'newest'
  const [locationMetadata, setLocationMetadata] = useState(null);

  // Get Laravel API base URL from environment or use default
  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // If the path already includes 'storage/' prefix, use it directly with base URL
    if (cleanPath.startsWith('storage/')) {
      return `${LARAVEL_API_BASE}/${cleanPath}`;
    }

    // If the path already includes 'property-images/', prepend only 'storage/'
    if (cleanPath.includes('property-images/')) {
      return `${LARAVEL_API_BASE}/storage/${cleanPath}`;
    }

    // Otherwise, construct full path with storage/property-images/
    return `${LARAVEL_API_BASE}/storage/property-images/${cleanPath}`;
  };

  // Helper function to process image arrays
  const processImageArray = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => getImageUrl(img)).filter(Boolean);
  };

  // Helper function to clean location - extract only city name
  const cleanLocationForBackend = (locationString) => {
    if (!locationString || typeof locationString !== 'string') return '';

    // Remove extra whitespace
    const trimmed = locationString.trim();

    // If location contains comma, take only the first part (city)
    // Examples: "Mzuzu, Malawi" -> "Mzuzu", "New York, NY, USA" -> "New York"
    const cityOnly = trimmed.split(',')[0].trim();

    // Log the cleaning process
    if (trimmed !== cityOnly) {
      console.log('🧹 Location cleaned for backend:', {
        original: trimmed,
        cleaned: cityOnly,
        removed: trimmed.replace(cityOnly, '').trim()
      });
    }

    return cityOnly;
  };

  // Location-based property fetching
  const fetchPropertiesByLocation = async (location, strategy = 'basic') => {
    // Clean the location to get only city name
    const cleanedLocation = cleanLocationForBackend(location);

    if (!cleanedLocation) {
      throw new Error('INVALID_LOCATION');
    }

    const timestamp = new Date().getTime();

    let apiUrl;
    if (strategy === 'advanced') {
      // Use advanced endpoint with fallback strategy
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location-advanced?location=${encodeURIComponent(cleanedLocation)}&fallback=${fallbackStrategy}&limit=20&t=${timestamp}`;
    } else {
      // Use basic endpoint with simple fallback
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location?location=${encodeURIComponent(cleanedLocation)}&limit=20&t=${timestamp}`;
    }

    console.log('🌍 Location-based API Request:', {
      originalLocation: location,
      cleanedLocation,
      strategy,
      fallbackStrategy,
      apiUrl,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();

    // Log response metadata
    if (data.meta) {
      console.log('🏠 Location Response Metadata:', {
        requestedLocation: data.meta.requested_location,
        strategyUsed: data.meta.strategy_used,
        locationMatch: data.meta.location_match,
        totalReturned: data.meta.total_returned,
        message: data.meta.message
      });
      setLocationMetadata(data.meta);
    }

    // Return properties array (handle both formats)
    return data.properties || data || [];
  };

  // Fallback to get all properties
  const fetchAllProperties = async () => {
    const timestamp = new Date().getTime();
    const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/all?t=${timestamp}`;

    console.log('🏘️ Fallback to All Properties:', {
      apiUrl,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    return await response.json();
  };

  // Main data fetching function
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setLocationMetadata(null);

        let propertiesData = [];

        // Strategy 1: If user location is provided, try location-based search
        if (userLocation && userLocation.trim()) {
          const cleanedUserLocation = cleanLocationForBackend(userLocation);

          if (cleanedUserLocation) {
            console.log('🎯 Starting location-based property search:', {
              originalUserLocation: userLocation,
              cleanedUserLocation,
              strategy: locationStrategy,
              fallbackStrategy,
              timestamp: new Date().toISOString()
            });

            try {
              propertiesData = await fetchPropertiesByLocation(userLocation, locationStrategy);
            } catch (locationError) {
              console.warn('⚠️ Location-based search failed, falling back to all properties:', {
                error: locationError.message,
                originalUserLocation: userLocation,
                cleanedUserLocation,
                strategy: locationStrategy
              });

              // If location-based search fails, fall back to all properties
              propertiesData = await fetchAllProperties();
            }
          } else {
            console.log('⚠️ Invalid user location after cleaning, fetching all properties');
            propertiesData = await fetchAllProperties();
          }
        } else {
          console.log('🏘️ No user location provided, fetching all properties');
          propertiesData = await fetchAllProperties();
        }

        // Validate properties data structure
        if (!Array.isArray(propertiesData)) {
          console.error('❌ Invalid data format received:', typeof propertiesData);
          throw new Error('INVALID_DATA_FORMAT');
        }

        console.log('📊 Properties Data Received:', {
          totalProperties: propertiesData.length,
          hasLocation: !!userLocation,
          locationMetadata: locationMetadata,
          sampleProperty: propertiesData[0] ? {
            id: propertiesData[0].id,
            title: propertiesData[0].title,
            location: propertiesData[0].location,
            hasImage: !!propertiesData[0].image
          } : null
        });

        // Process and validate each property with proper image URL construction
        const validatedProperties = propertiesData.map(property => {
          // Get the primary image
          const primaryImage = property.image || property.featured_image ||
                             (property.images && property.images[0]);

          // Process all images
          const allImages = property.images || (primaryImage ? [primaryImage] : []);

          // Construct full image URLs
          const fullImageUrl = getImageUrl(primaryImage);
          const processedImages = processImageArray(allImages);

          // Create a placeholder image URL for properties without images
         const placeholderImage = `data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzAwIDI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ic2t5R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6Izg3Q0VFQjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRTBGNkZGO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icm9vZkdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4QjQ1MTM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY1NDMyMTtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImhvdXNlR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Y1RjVEQztzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRTZFNkNEO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JvdW5kR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzkwRUU5MDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN0NCMzQyO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgCiAgPCEtLSBTa3kgYmFja2dyb3VuZCAtLT4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNza3lHcmFkaWVudCkiLz4KICA8IS0tIEdyb3VuZCAtLT4KICA8cmVjdCB4PSIwIiB5PSIxODAiIHdpZHRoPSIzMDAiIGhlaWdodD0iNzAiIGZpbGw9InVybCgjZ3JvdW5kR3JhZGllbnQpIi8+CiAgCiAgPCEtLSBTdW4gLS0+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMTgiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOCIvPgogIDxnIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjYiPgogICAgPGxpbmUgeDE9IjIwIiB5MT0iNDAiIHgyPSIyOCIgeTI9IjQwIi8+CiAgICA8bGluZSB4MT0iNzIiIHkxPSI0MCIgeDI9IjgwIiB5Mj0iNDAiLz4KICAgIDxsaW5lIHgxPSI1MCIgeTE9IjEwIiB4Mj0iNTAiIHkyPSIxOCIvPgogICAgPGxpbmUgeDE9IjUwIiB5MT0iNjIiIHgyPSI1MCIgeTI9IjcwIi8+CiAgICA8bGluZSB4MT0iMjguOCIgeTE9IjE4LjgiIHgyPSIzNC4xIiB5Mj0iMjQuMSIvPgogICAgPGxpbmUgeDE9IjY1LjkiIHkxPSI1NS45IiB4Mj0iNzEuMiIgeTI9IjYxLjIiLz4KICAgIDxsaW5lIHgxPSI3MS4yIiB5MT0iMTguOCIgeDI9IjY1LjkiIHkyPSIyNC4xIi8+CiAgICA8bGluZSB4MT0iMzQuMSIgeTE9IjU1LjkiIHgyPSIyOC44IiB5Mj0iNjEuMiIvPgogIDwvZz4KICA8IS0tIENsb3VkcyAtLT4KICA8ZyBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC43Ij4KICAgIDxlbGxpcHNlIGN4PSIxODAiIGN5PSIzNSIgcng9IjEyIiByeT0iOCIvPgogICAgPGVsbGlwc2UgY3g9IjE5MCIgY3k9IjM1IiByeD0iMTUiIHJ5PSIxMCIvPgogICAgPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjM1IiByeD0iMTAiIHJ5PSI3Ii8+CiAgICA8ZWxsaXBzZSBjeD0iMjQwIiBjeT0iNTUiIHJ4PSI4IiByeT0iNiIvPgogICAgPGVsbGlwc2UgY3g9IjI0OCIgY3k9IjU1IiByeD0iMTAiIHJ5PSI4Ii8+CiAgICA8ZWxsaXBzZSBjeD0iMjU1IiBjeT0iNTUiIHJ4PSI3IiByeT0iNSIvPgogIDwvZz4KICA8IS0tIEhvdXNlIG1haW4gc3RydWN0dXJlIC0tPgogIDxyZWN0IHg9IjgwIiB5PSIxMjAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2hvdXNlR3JhZGllbnQpIiBzdHJva2U9IiNEM0QzRDMiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwhLS0gUm9vZiAtLT4KICA8cG9seWdvbiBwb2ludHM9IjcwLDEyMCAxNTAsNzAgMjMwLDEyMCIgZmlsbD0idXJsKCNyb29mR3JhZGllbnQpIiBzdHJva2U9IiM1RDRFMzciIHN0cm9rZS13aWR0aD0iMSIvPgogIDwhLS0gQ2hpbW5leSAtLT4KICA8cmVjdCB4PSIxOTAiIHk9IjgwIiB3aWR0aD0iMTUiIGhlaWdodD0iMjUiIGZpbGw9IiM4QjQ1MTMiIHN0cm9rZT0iIzY1NDMyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHJlY3QgeD0iMTg1IiB5PSI4MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjUiIGZpbGw9IiNBMDUyMkQiLz4KICA8IS0tIENoaW1uZXkgc21va2UgLS0+CiAgPGcgZmlsbD0ibGlnaHRncmF5IiBvcGFjaXR5PSIwLjYiPgogICAgPGNpcmNsZSBjeD0iMTk4IiBjeT0iNzAiIHI9IjMiLz4KICAgIDxjaXJjbGUgY3g9IjE5NSIgY3k9IjY1IiByPSIyLjUiLz4KICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjYwIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSIxOTciIGN5PSI1NSIgcj0iMS41Ii8+CiAgPC9nPgogIDwhLS0gRG9vciAtLT4KICA8cmVjdCB4PSIxMzUiIHk9IjE3MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOEI0NTEzIiBzdHJva2U9IiM2NTQzMjEiIHN0cm9rZS13aWR0aD0iMSIgcng9IjE1IiByeT0iMCIvPgogIDxjaXJjbGUgY3g9IjE1NyIgY3k9IjE5NSIgcj0iMiIgZmlsbD0iI0ZGRDcwMCIvPgogIDwhLS0gRG9vciBwYW5lbHMgLS0+CiAgPHJlY3QgeD0iMTQwIiB5PSIxNzUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjU0MzIxIiBzdHJva2Utd2lkdGg9IjEiIHJ4PSIyIi8+CiAgPHJlY3QgeD0iMTQwIiB5PSIxOTUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjU0MzIxIiBzdHJva2Utd2lkdGg9IjEiIHJ4PSIyIi8+CiAgPCEtLSBXaW5kb3dzIC0tPgogIDxyZWN0IHg9Ijk1IiB5PSIxNDAiIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgZmlsbD0iIzg3Q0VFQiIgc3Ryb2tlPSIjNDY4MkI0IiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIi8+CiAgPGxpbmUgeDE9IjEwNy41IiB5MT0iMTQwIiB4Mj0iMTA3LjUiIHkyPSIxNjUiIHN0cm9rZT0iIzQ2ODJCNCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPGxpbmUgeDE9Ijk1IiB5MT0iMTUyLjUiIHgyPSIxMjAiIHkyPSIxNTIuNSIgc3Ryb2tlPSIjNDY4MkI0IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIxODAiIHk9IjE0MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI1IiBmaWxsPSIjODdDRUVCIiBzdHJva2U9IiM0NjgyQjQiIHN0cm9rZS13aWR0aD0iMiIgcng9IjIiLz4KICA8bGluZSB4MT0iMTkyLjUiIHkxPSIxNDAiIHgyPSIxOTIuNSIgeTI9IjE2NSIgc3Ryb2tlPSIjNDY4MkI0IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8bGluZSB4MT0iMTgwIiB5MT0iMTUyLjUiIHgyPSIyMDUiIHkyPSIxNTIuNSIgc3Ryb2tlPSIjNDY4MkI0IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8IS0tIFVwc3RhaXJzIHdpbmRvdyAtLT4KICA8cmVjdCB4PSIxMzcuNSIgeT0iMTAwIiB3aWR0aD0iMjUiIGhlaWdodD0iMjAiIGZpbGw9IiM4N0NFRUIiIHN0cm9rZT0iIzQ2ODJCNCIgc3Ryb2tlLXdpZHRoPSIyIiByeD0iMiIvPgogIDxsaW5lIHgxPSIxNTAiIHkxPSIxMDAiIHgyPSIxNTAiIHkyPSIxMjAiIHN0cm9rZT0iIzQ2ODJCNCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPGxpbmUgeDE9IjEzNy41IiB5MT0iMTEwIiB4Mj0iMTYyLjUiIHkyPSIxMTAiIHN0cm9rZT0iIzQ2ODJCNCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPCEtLSBXaW5kb3cgYm94ZXMgd2l0aCBmbG93ZXJzIC0tPgogIDxyZWN0IHg9IjkzIiB5PSIxNjUiIHdpZHRoPSIyOSIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTc4IiB5PSIxNjUiIHdpZHRoPSIyOSIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPCEtLSBGbG93ZXJzIGluIHdpbmRvdyBib3hlcyAtLT4KICA8Zz4KICAgIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MyIgcj0iMS41IiBmaWxsPSIjRkY2OUI0Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDUiIGN5PSIxNjMiIHI9IjEuNSIgZmlsbD0iI0ZGMTQ5MyIvPgogICAgPGNpcmNsZSBjeD0iMTEwIiBjeT0iMTYzIiByPSIxLjUiIGZpbGw9IiNGRkI2QzEiLz4KICAgIDxjaXJjbGUgY3g9IjExNSIgY3k9IjE2MyIgcj0iMS41IiBmaWxsPSIjRkY2OUI0Ii8+CiAgICA8Y2lyY2xlIGN4PSIxODUiIGN5PSIxNjMiIHI9IjEuNSIgZmlsbD0iIzkzNzBEQiIvPgogICAgPGNpcmNsZSBjeD0iMTkwIiBjeT0iMTYzIiByPSIxLjUiIGZpbGw9IiM4QTJCRTIiLz4KICAgIDxjaXJjbGUgY3g9IjE5NSIgY3k9IjE2MyIgcj0iMS41IiBmaWxsPSIjOTM3MERCIi8+CiAgICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjMiIHI9IjEuNSIgZmlsbD0iI0REQTBERCIvPgogIDwvZz4KICA8IS0tIFRyZWUgLS0+CiAgPGVsbGlwc2UgY3g9IjM1IiBjeT0iMTYwIiByeD0iMjAiIHJ5PSIyNSIgZmlsbD0iIzIyOEIyMiIvPgogIDxyZWN0IHg9IjMyIiB5PSIxODAiIHdpZHRoPSI2IiBoZWlnaHQ9IjE1IiBmaWxsPSIjOEI0NTEzIi8+CiAgPCEtLSBQYXRoIHRvIGRvb3IgLS0+CiAgPHBhdGggZD0iTSAxNTAgMjIwIFEgMTUwIDIxMCAxNTAgMjAwIFEgMTUwIDE5MCAxNTAgMTgwIiBzdHJva2U9IiNEMkI0OEMiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC42Ii8+CiAgPCEtLSBHYXJkZW4gZWxlbWVudHMgLS0+CiAgPGNpcmNsZSBjeD0iMjYwIiBjeT0iMjAwIiByPSI4IiBmaWxsPSIjMzJDRDMyIi8+CiAgPGNpcmNsZSBjeD0iMjcwIiBjeT0iMTk1IiByPSI2IiBmaWxsPSIjMjI4QjIyIi8+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjA1IiByPSI1IiBmaWxsPSIjN0NGQzAwIi8+Cjwvc3ZnPg==`;

          return {
            ...property,
            // Ensure required fields have fallbacks
            id: property.id || `temp_${Date.now()}_${Math.random()}`,
            title: property.title || property.name || 'Untitled Property',
            price: property.price || property.rent || 'Price not available',
            location: property.location || property.address || property.city || 'Location not specified',

            // Updated image handling with full URLs and placeholder fallback
            image: fullImageUrl || placeholderImage,
            images: processedImages.length > 0 ? processedImages : [placeholderImage],
            image_count: property.image_count || (processedImages.length > 0 ? processedImages.length : 1),
            hasRealImage: !!fullImageUrl, // Flag to indicate if property has real images

            // Status handling
            status: property.status || property.current_status || 'available',
            // Rating handling
            rating: property.rating || property.average_rating || null,
            // Favorite status
            isFavorite: property.isFavorite || property.is_favorite || false
          };
        });

        // Show all properties (don't filter based on images anymore)
        console.log('✅ Properties processed successfully:', {
          originalCount: propertiesData.length,
          withRealImagesCount: validatedProperties.filter(p => p.hasRealImage).length,
          withPlaceholderCount: validatedProperties.filter(p => !p.hasRealImage).length,
          totalDisplayed: validatedProperties.length
        });

        setProperties(validatedProperties);

        // Optionally fetch available locations for future reference
        try {
          const timestamp = new Date().getTime();
          const locationsUrl = `${LARAVEL_API_BASE}/api/tenant/properties/locations?t=${timestamp}`;

          const locationsResponse = await fetch(locationsUrl, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json();
            setLocations(Array.isArray(locationsData) ? locationsData : []);
            console.log('📍 Available locations fetched:', locationsData.length);
          } else {
            setLocations([]);
          }
        } catch (locationsError) {
          console.warn('⚠️ Could not fetch locations:', locationsError.message);
          setLocations([]);
        }

      } catch (err) {
        console.error('❌ Error in fetchData:', {
          error: err.message,
          stack: err.stack,
          userLocation,
          strategy: locationStrategy
        });
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount, LARAVEL_API_BASE, userLocation, locationStrategy, fallbackStrategy]);

  // Retry function
  const handleRetry = () => {
    console.log('🔄 Retry requested:', { retryCount, userLocation, locationStrategy });
    setRetryCount(prev => prev + 1);
  };

  // Toggle location strategy (for testing/debugging)
  const toggleLocationStrategy = () => {
    const newStrategy = locationStrategy === 'basic' ? 'advanced' : 'basic';
    console.log('🔀 Switching location strategy:', { from: locationStrategy, to: newStrategy });
    setLocationStrategy(newStrategy);
    setRetryCount(prev => prev + 1); // Force refresh
  };

  // Toggle fallback strategy (for advanced mode)
  const toggleFallbackStrategy = () => {
    const strategies = ['random', 'popular', 'newest'];
    const currentIndex = strategies.indexOf(fallbackStrategy);
    const newStrategy = strategies[(currentIndex + 1) % strategies.length];
    console.log('🎲 Switching fallback strategy:', { from: fallbackStrategy, to: newStrategy });
    setFallbackStrategy(newStrategy);
    if (locationStrategy === 'advanced') {
      setRetryCount(prev => prev + 1); // Force refresh only if in advanced mode
    }
  };

  // Algorithm to sort properties by location (user's location first) - Enhanced
  const sortPropertiesByLocation = (properties, userLocation) => {
    if (!userLocation || !properties.length) return properties;

    const cleanedUserLocation = cleanLocationForBackend(userLocation);

    console.log('🔍 Sorting properties by location:', {
      originalUserLocation: userLocation,
      cleanedUserLocation,
      totalProperties: properties.length
    });

    const userLocationProperties = [];
    const partialMatchProperties = [];
    const otherLocationProperties = [];

    const userLocationLower = cleanedUserLocation.toLowerCase();

    properties.forEach(property => {
      const locationFields = [
        property.location,
        property.city,
        property.address,
        property.area,
        property.neighborhood
      ].filter(Boolean);

      // Check for exact or close matches using cleaned location
      const exactMatch = locationFields.some(field => {
        if (!field) return false;
        const cleanedField = cleanLocationForBackend(field).toLowerCase();
        return cleanedField === userLocationLower;
      });

      const partialMatch = locationFields.some(field => {
        if (!field) return false;
        const cleanedField = cleanLocationForBackend(field).toLowerCase();
        return cleanedField.includes(userLocationLower) || userLocationLower.includes(cleanedField);
      });

      if (exactMatch) {
        userLocationProperties.push(property);
      } else if (partialMatch) {
        partialMatchProperties.push(property);
      } else {
        otherLocationProperties.push(property);
      }
    });

    console.log('📊 Location sorting results:', {
      cleanedUserLocation,
      exactMatches: userLocationProperties.length,
      partialMatches: partialMatchProperties.length,
      otherProperties: otherLocationProperties.length
    });

    return [...userLocationProperties, ...partialMatchProperties, ...otherLocationProperties];
  };

  const sortedProperties = sortPropertiesByLocation(properties, userLocation);

  // Custom error component based on error type
  const renderError = (errorType) => {
    const errorConfigs = {
      'API_NOT_FOUND': {
        icon: <Database className="w-12 h-12 text-red-400" />,
        title: 'Service Unavailable',
        message: 'The property listing service is currently unavailable. Please check if the Laravel backend is running.',
        suggestion: 'Ensure your Laravel server is running on http://localhost:8000',
        color: 'red'
      },
      'HTTP_401': {
        icon: <Lock className="w-12 h-12 text-red-400" />,
        title: 'Authentication Required',
        message: 'You need to be authenticated to access property listings.',
        suggestion: 'Please log in to your account and try again.',
        color: 'red'
      },
      'HTTP_500': {
        icon: <AlertCircle className="w-12 h-12 text-orange-400" />,
        title: 'Server Error',
        message: 'The Laravel backend server encountered an error while processing your request.',
        suggestion: 'Check the Laravel server logs for more details. This is usually temporary.',
        color: 'orange'
      },
      'HTTP_403': {
        icon: <Lock className="w-12 h-12 text-purple-400" />,
        title: 'Access Denied',
        message: 'You do not have permission to access property listings.',
        suggestion: 'Please check your authentication credentials or contact support.',
        color: 'purple'
      },
      'NETWORK_ERROR': {
        icon: <WifiOff className="w-12 h-12 text-gray-400" />,
        title: 'Connection Error',
        message: 'Unable to connect to the Laravel backend server. Please check your connection.',
        suggestion: 'Verify the backend server is running and your network connection is stable.',
        color: 'gray'
      },
      'INVALID_DATA_FORMAT': {
        icon: <Database className="w-12 h-12 text-yellow-400" />,
        title: 'Data Format Error',
        message: 'The Laravel backend returned data in an unexpected format.',
        suggestion: 'This indicates a server-side issue. Please check your API endpoint response.',
        color: 'yellow'
      },
      'UNKNOWN_ERROR': {
        icon: <AlertCircle className="w-12 h-12 text-red-400" />,
        title: 'Unexpected Error',
        message: 'An unexpected error occurred while loading properties from the backend.',
        suggestion: 'Please try refreshing the page or check the browser console for more details.',
        color: 'red'
      }
    };

    const config = errorConfigs[errorType] || errorConfigs['UNKNOWN_ERROR'];

    return (
      <div className="text-center py-16">
        <div className={`bg-${config.color}-50 border border-${config.color}-200 rounded-xl p-8 max-w-lg mx-auto`}>
          <div className="flex flex-col items-center">
            {config.icon}
            <h3 className={`text-${config.color}-800 font-bold text-xl mt-4 mb-2`}>
              {config.title}
            </h3>
            <p className={`text-${config.color}-700 text-sm mb-4 text-center leading-relaxed`}>
              {config.message}
            </p>
            <p className={`text-${config.color}-600 text-xs mb-6 text-center`}>
              {config.suggestion}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className={`px-6 py-2 bg-${config.color}-600 text-white rounded-lg text-sm hover:bg-${config.color}-700 transition-colors duration-200 flex items-center`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
              </button>
              {errorType === 'NETWORK_ERROR' && (
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Wifi className="w-4 h-4 mr-1" />
                  Check Laravel server status
                </div>
              )}
              {(errorType === 'API_NOT_FOUND' || errorType === 'HTTP_500') && (
                <div className="text-xs text-gray-500 mt-2">
                  Backend URL: {LARAVEL_API_BASE}/api/tenant/properties/location
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
            <p className="text-gray-700 text-base font-medium">Loading Properties</p>
            <p className="text-gray-500 text-sm mt-1">
              {userLocation
                ? `Searching for properties in ${userLocation}...`
                : 'Fetching from Laravel backend...'
              }
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {userLocation
                ? `${LARAVEL_API_BASE}/api/tenant/properties/location`
                : `${LARAVEL_API_BASE}/api/tenant/properties/all`
              }
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return renderError(error);
  }

  if (!sortedProperties.length) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 max-w-md mx-auto">
          <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-700 font-bold text-xl mb-2">No Properties Available</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {userLocation
              ? `No properties found in ${userLocation} and no fallback properties available.`
              : 'The Laravel backend returned no properties.'
            }
          </p>
          <p className="text-gray-400 text-xs mb-4">
            API Endpoint: {userLocation ? `${LARAVEL_API_BASE}/api/tenant/properties/location` : `${LARAVEL_API_BASE}/api/tenant/properties/all`}<br/>
            Images served from: {LARAVEL_API_BASE}/storage/property-images/
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh from Backend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Search Status */}
      {userLocation && locationMetadata && (
        <div className={`border rounded-lg p-4 ${
          locationMetadata.location_match
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <MapPin className={`w-4 h-4 mr-2 ${
                locationMetadata.location_match ? 'text-green-600' : 'text-blue-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  locationMetadata.location_match ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {locationMetadata.message}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Strategy: {locationMetadata.strategy_used} • Found: {locationMetadata.total_returned} properties
                  {userLocation !== cleanLocationForBackend(userLocation) && (
                    <span className="ml-2 text-gray-500">
                      (Searched for: {cleanLocationForBackend(userLocation)})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Debug Controls */}
            <div className="flex space-x-2">
              <button
                onClick={toggleLocationStrategy}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
              >
                {locationStrategy === 'basic' ? 'Switch to Advanced' : 'Switch to Basic'}
              </button>
              {locationStrategy === 'advanced' && (
                <button
                  onClick={toggleFallbackStrategy}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                >
                  Fallback: {fallbackStrategy}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standard location message for when no metadata */}
      {userLocation && !locationMetadata && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Showing properties prioritized for your location: <strong className="ml-1">{cleanLocationForBackend(userLocation)}</strong>
            {userLocation !== cleanLocationForBackend(userLocation) && (
              <span className="ml-2 text-xs text-gray-600">
                (from "{userLocation}")
              </span>
            )}
          </p>
        </div>
      )}

      {/* Show information about properties with/without images */}
      {sortedProperties.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Showing {sortedProperties.length} properties
            ({sortedProperties.filter(p => p.hasRealImage).length} with images, {' '}
            {sortedProperties.filter(p => !p.hasRealImage).length} with placeholder images)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProperties.map((property) => (
          <HouseCard
            key={property.id}
            house={property}
            isSubscribed={isSubscribed}
            subscriptionStatus={subscriptionStatus}
            daysRemaining={daysRemaining}
            onToggleFavorite={onToggleFavorite}
            laravelApiBase={LARAVEL_API_BASE}
          />
        ))}
      </div>

      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-gray-500 text-sm flex items-center justify-center">
          <Database className="w-4 h-4 mr-2" />
          Displaying {sortedProperties.length} properties from Laravel backend
          {userLocation && ` (Location: ${userLocation})`}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          API: {userLocation ? `${LARAVEL_API_BASE}/api/tenant/properties/location` : `${LARAVEL_API_BASE}/api/tenant/properties/all`}<br/>
          Strategy: {locationStrategy} • Fallback: {fallbackStrategy}<br/>
          Images: {LARAVEL_API_BASE}/storage/property-images/
        </p>
      </div>
    </div>
  );
};

// Loading skeleton component
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

// Image count badge component
const ImageCountBadge = ({ house, hasActiveAccess }) => {
  const imageCount = house.image_count || (house.images ? house.images.length : 0);

  if (!hasActiveAccess || !imageCount || imageCount <= 1) return null;

  return (
    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
      <Camera className="w-3 h-3 mr-1" />
      {imageCount}
    </div>
  );
};

// Updated HouseCard component - displays backend data with proper image handling
const HouseCard = ({
  house,
  isSubscribed,
  subscriptionStatus,
  daysRemaining = 0,
  onToggleFavorite,
  laravelApiBase
}) => {
  const router = useRouter();

  // Use the property status hook to fetch real-time status
  const { status: fetchedStatus, isLoading: statusLoading, error: statusError } = usePropertyStatus(house.id);

  const handleBook = (id) => {
    if (isSubscribed && id) {
      router.push(`/properties/${id}`);
    }
  };

  // Enhanced image error handling with multiple fallback attempts
  const handleImageError = (e, house) => {
    const baseUrl = laravelApiBase || 'http://localhost:8000';

    // If it's already a placeholder SVG, don't try to replace it
    if (e.target.src.startsWith('data:image/svg+xml')) {
      return;
    }

    // Extract just the filename from the original image path
    const originalPath = house.image;
    const filename = originalPath && originalPath.includes('/') ?
      originalPath.split('/').pop() :
      originalPath;

    // Define fallback image paths in order of preference
    const fallbackPaths = [
      // Try the original path as-is (in case it's already correct)
      originalPath && originalPath.startsWith('http') ? originalPath : `${baseUrl}/${originalPath}`,
      // Try with storage/ prefix if not already present
      `${baseUrl}/storage/${originalPath}`,
      // Try direct filename in storage/property-images/
      filename ? `${baseUrl}/storage/property-images/${filename}` : null,
      // Try without storage/ prefix
      filename ? `${baseUrl}/property-images/${filename}` : null,
      // Try in images directory
      filename ? `${baseUrl}/images/property-images/${filename}` : null,
      // Try in public directory
      filename ? `${baseUrl}/public/storage/property-images/${filename}` : null,
      // Try direct storage app path
      filename ? `${baseUrl}/storage/app/public/property-images/${filename}` : null,
      // Fallback to placeholder images
      `${baseUrl}/images/placeholder-property.jpg`,
      `${baseUrl}/images/no-image-available.png`
    ].filter(Boolean);

    // Get current URL to determine which fallback to try next
    const currentSrc = e.target.src;
    let nextFallbackIndex = 0;

    // Find which fallback we're currently on
    for (let i = 0; i < fallbackPaths.length; i++) {
      if (currentSrc.includes(fallbackPaths[i]) || currentSrc === fallbackPaths[i]) {
        nextFallbackIndex = i + 1;
        break;
      }
    }

    // Try next fallback if available
    if (nextFallbackIndex < fallbackPaths.length) {
      e.target.src = fallbackPaths[nextFallbackIndex];
    } else {
      // All fallbacks failed, use placeholder SVG
      e.target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=`;
    }
  };

  // Determine if features should be active
  const hasActiveAccess = isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;

  // Get subscription status message
  const getSubscriptionMessage = () => {
    if (!isSubscribed) return "Subscribe to unlock";
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') return "Processing payment...";
    if (subscriptionStatus === 'active' && daysRemaining === 0) return "Subscription expired";
    if (subscriptionStatus === 'canceled') return "Subscription canceled";
    return "Subscribe to unlock";
  };

  // Use fetched status with fallback to house.status
  const propertyStatus = fetchedStatus || house.status || 'vacant';
  const isPropertyAvailable = propertyStatus === 'vacant' || propertyStatus === 'available';

  const getLocationText = () => {
    if (hasActiveAccess) {
      return house.location || 'Location not provided';
    }
    return getSubscriptionMessage();
  };

  const getButtonText = () => {
    if (!hasActiveAccess) return getSubscriptionMessage();
    if (!isPropertyAvailable) {
      // More descriptive text based on status
      switch (propertyStatus) {
        case 'booked':
          return "Currently Occupied";
        case 'maintenance':
          return "Under Maintenance";
        case 'unavailable':
          return "Not Available";
        default:
          return "Currently Occupied";
      }
    }
    return "Book Viewing";
  };

  const getButtonIcon = () => {
    if (!hasActiveAccess) return <Lock className="mr-1 text-sm" />;
    if (!isPropertyAvailable) return <Clock className="mr-1 text-sm" />;
    return <Calendar className="mr-1 text-sm" />;
  };

  // Check if this property has a real image or is using placeholder
  const isPlaceholderImage = house.image && house.image.startsWith('data:image/svg+xml');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative">
      {/* Subscription Status Overlay */}
      {!hasActiveAccess && (
        <div className="absolute inset-0 bg-gray-900/60 z-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-white p-4">
            <Lock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">{getSubscriptionMessage()}</p>
            {subscriptionStatus === 'active' && daysRemaining === 0 && (
              <p className="text-xs mt-1 text-gray-300">Renew to continue access</p>
            )}
            {(subscriptionStatus === 'processing' || subscriptionStatus === 'pending') && (
              <p className="text-xs mt-1 text-gray-300">Please wait for confirmation</p>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={house.image}
          alt={house.title}
          className={`w-full h-56 object-cover transition-all duration-300 ${
            !hasActiveAccess ? 'filter blur-sm grayscale' : ''
          } ${isPlaceholderImage ? 'bg-gray-100' : ''}`}
          onError={(e) => handleImageError(e, house)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* No Image Indicator for properties without real images */}
        {hasActiveAccess && !house.hasRealImage && (
          <div className="absolute top-2 left-2 bg-gray-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Camera className="w-3 h-3 mr-1" />
            No Photo
          </div>
        )}

        {/* Property Status Badge - Now using StatusBadge component */}
        {hasActiveAccess && propertyStatus && house.hasRealImage && (
          <div className="absolute top-2 left-2">
            <StatusBadge
              status={propertyStatus}
              size="small"
              showIcon={true}
              showText={true}
            />
          </div>
        )}

        {/* Property Status Badge for properties without images */}
        {hasActiveAccess && propertyStatus && !house.hasRealImage && (
          <div className="absolute top-8 left-2">
            <StatusBadge
              status={propertyStatus}
              size="small"
              showIcon={true}
              showText={true}
            />
          </div>
        )}

        {/* Status loading indicator for non-subscribed users */}
        {!hasActiveAccess && (
          <div className="absolute top-2 right-2 bg-gray-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {statusLoading ? '...' : 'LOCKED'}
          </div>
        )}

        {/* Image Count Badge - only show for properties with real images */}
        {house.hasRealImage && <ImageCountBadge house={house} hasActiveAccess={hasActiveAccess} />}

        {/* Favorite Button */}
        <button
          onClick={() => hasActiveAccess && onToggleFavorite && onToggleFavorite(house.id)}
          className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 ${
            hasActiveAccess
              ? 'bg-white/90 hover:bg-white'
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
          disabled={!hasActiveAccess}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              !hasActiveAccess
                ? "text-gray-300"
                : house.isFavorite
                ? "text-red-500 fill-current"
                : "text-gray-600 hover:text-red-400"
            }`}
          />
        </button>

        {/* Subscription Status Badge */}
        {hasActiveAccess && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute top-12 right-4 bg-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {daysRemaining} days left
          </div>
        )}

        {/* Price */}
        <div className={`absolute bottom-4 left-4 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-base shadow-sm ${
          hasActiveAccess
            ? 'bg-white/95 text-gray-900'
            : 'bg-gray-500/50 text-gray-200'
        }`}>
          {hasActiveAccess ? house.price : '••••••'}
          {hasActiveAccess && house.price && (
            <span className="text-xs font-normal text-gray-600 ml-1">/month</span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-sm leading-tight truncate pr-2 ${
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

        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className={`text-sm font-medium ${
            hasActiveAccess ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {getLocationText()}
          </span>
        </div>

        {/* Action Button */}
        {/* <button
          onClick={() => handleBook(house.id)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
            hasActiveAccess && isPropertyAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!hasActiveAccess || !isPropertyAvailable}
        >
          <div className="flex items-center justify-center">
            {getButtonIcon()}
            {getButtonText()}
          </div>
        </button> */}

        <button
  onClick={() => handleBook(house.id)}
  className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
    hasActiveAccess && isPropertyAvailable
      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
      : "bg-gray-200 text-gray-500 cursor-not-allowed"
  }`}
  disabled={!hasActiveAccess || !isPropertyAvailable}
>
  <div className="flex items-center justify-center">
    {getButtonIcon()}
    {getButtonText()}
  </div>
</button>


        {/* Subscription Info */}
        {!hasActiveAccess && (
          <div className="mt-3 text-center text-xs text-gray-500">
            {subscriptionStatus === 'processing'
              ? 'Payment being processed'
              : daysRemaining === 0 && subscriptionStatus === 'active'
              ? 'Subscription expired - Renew to continue'
              : 'Premium feature - Subscribe to unlock'
            }
          </div>
        )}

        {/* Image status indicator for properties without real images */}
        {hasActiveAccess && !house.hasRealImage && (
          <div className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center">
            <Camera className="w-3 h-3 mr-1" />
            Photos coming soon
          </div>
        )}
      </div>
    </div>
  );
};

// Export both components
export default HouseCard;
export { PropertyListContainer };

