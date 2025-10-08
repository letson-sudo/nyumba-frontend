

import axios from '@/lib/axios'

// API Configuration - Properly configured to avoid CSRF issues
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create axios instance with API-specific configuration
export const createApiClient = () => {
  const config = {
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // This header tells Laravel it's an AJAX request
      'X-Requested-With': 'XMLHttpRequest',
    }
  };

  // Add auth token if available
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  const client = axios.create(config);

  // Add response interceptor for better error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log the full error for debugging
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      return Promise.reject(error);
    }
  );

  return client;
};

// Enhanced error handler with specific messaging
export const handleApiError = (error, setError) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        setError('Authentication required. Please log in again.');
        break;
      case 403:
        setError('Access denied. Please check your permissions.');
        break;
      case 419:
        setError('Session expired. Please refresh the page and try again.');
        break;
      case 422:
        // Handle validation errors specifically
        if (data?.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages[0] || 'Validation failed');
        } else {
          setError(data?.message || 'Please check your input and try again.');
        }
        break;
      case 400:
        setError(data?.message || 'Invalid request. Please check your input.');
        break;
      case 500:
        setError('Server error. Please try again later.');
        break;
      default:
        setError(data?.message || `Request failed (${status})`);
    }
  } else if (error.request) {
    setError('Network error. Please check your connection and try again.');
  } else {
    setError(`Error: ${error.message}`);
  }
};

// CSRF token refresh function - No longer needed with session auth
export const refreshCsrfToken = async () => {
  // Session-based authentication handles CSRF automatically
  console.info('Using session-based authentication - CSRF handled automatically');
};
