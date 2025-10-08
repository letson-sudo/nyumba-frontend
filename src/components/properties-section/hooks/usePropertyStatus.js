import { useState, useEffect } from 'react';

const usePropertyStatus = (propertyId) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Laravel API base URL
  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';

  const fetchPropertyStatus = async () => {
    if (!propertyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔍 Fetching status for property ID: ${propertyId}`);

      // First try to get the specific property status
      const response = await fetch(`${LARAVEL_API_BASE}/api/properties/${propertyId}/status`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Status fetched for property ${propertyId}:`, data);

        // Handle different response formats
        const propertyStatus = data.status || data.data?.status || 'vacant';
        setStatus(propertyStatus);
      } else {
        // If specific endpoint doesn't exist, fallback to booked units check
        console.log(`⚠️ Specific status endpoint failed, checking booked units for property ${propertyId}`);
        await fetchFromBookedUnits();
      }

    } catch (err) {
      console.error(`❌ Error fetching status for property ${propertyId}:`, err);
      // Fallback to booked units check
      await fetchFromBookedUnits();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFromBookedUnits = async () => {
    try {
      console.log(`🔄 Fallback: Checking booked units for property ${propertyId}`);

      const response = await fetch(`${LARAVEL_API_BASE}/api/status/booked`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`📥 Booked units response for property ${propertyId}:`, data);

        if (data?.success) {
          // Find the current property in the booked units list
          const bookedProperties = data.data?.properties || [];
          const foundProperty = bookedProperties.find(p =>
            p.property_id === parseInt(propertyId) ||
            p.property?.id === parseInt(propertyId) ||
            p.id === parseInt(propertyId)
          );

          const propertyStatus = foundProperty ? 'booked' : 'vacant';
          setStatus(propertyStatus);
          console.log(`✅ Status determined from booked units for property ${propertyId}: ${propertyStatus}`);
        } else {
          // Default to vacant if we can't determine status
          setStatus('vacant');
          console.log(`⚠️ Could not determine status for property ${propertyId}, defaulting to vacant`);
        }
      } else {
        // If all else fails, default to vacant
        setStatus('vacant');
        setError('Could not fetch property status');
        console.log(`❌ All status checks failed for property ${propertyId}, defaulting to vacant`);
      }

    } catch (fallbackErr) {
      console.error(`❌ Fallback status fetch failed for property ${propertyId}:`, fallbackErr);
      setStatus('vacant');
      setError('Could not fetch property status');
    }
  };

  // Fetch status on mount and when propertyId changes
  useEffect(() => {
    fetchPropertyStatus();
  }, [propertyId]);

  // Function to manually refresh status
  const refreshStatus = () => {
    fetchPropertyStatus();
  };

  // Function to update status locally (for optimistic updates)
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  return {
    status,
    isLoading,
    error,
    refreshStatus,
    updateStatus
  };
};

export default usePropertyStatus;
