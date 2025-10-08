"use client";

import React, { useMemo } from "react";
import usePropertyData from "@/hooks/usePropertyData"; // ✅ default import
import PropertyCard from "./PropertyCard";            // adjust path if needed
import LoadingSpinner from "../common/LoadingSpinner"; // optional loader component
import ErrorMessage from "../common/ErrorMessage";     // optional error component
import { LARAVEL_API_BASE } from "@/config";           // make sure this is correct

/**
 * Displays a list of tenant properties with location-based fetching
 */
export default function PropertyListContainer({ userLocation }) {
  const {
    properties,
    loading,
    error,
    locationMetadata,
    refetch
  } = usePropertyData({
    laravelApiBase: LARAVEL_API_BASE,
    userLocation,
    locationStrategy: "basic",
    fallbackStrategy: "basic"
  });

  // Example of sorting by location if metadata includes coordinates
  const sortedProperties = useMemo(() => {
    if (!properties || !locationMetadata?.coordinates) return properties;

    const { lat: userLat, lng: userLng } = locationMetadata.coordinates;

    const distance = (lat1, lon1, lat2, lon2) => {
      const toRad = (v) => (v * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return [...properties].sort((a, b) => {
      if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
      const distA = distance(userLat, userLng, a.latitude, a.longitude);
      const distB = distance(userLat, userLng, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [properties, locationMetadata]);

  if (loading) return <LoadingSpinner message="Loading properties…" />;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={refetch} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}

      {!sortedProperties.length && (
        <div className="col-span-full text-center text-gray-500 py-8">
          No properties found.
        </div>
      )}
    </div>
  );
}
