// hooks/useImageHandler.jsx
import { useCallback } from 'react';
import { createImageErrorFallback } from '../utils/imageUtils';

export const useImageHandler = (laravelApiBase) => {
  const handleImageError = useCallback((e, house) => {
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
      e.target.src = createImageErrorFallback();
    }
  }, [laravelApiBase]);

  return { handleImageError };
};
