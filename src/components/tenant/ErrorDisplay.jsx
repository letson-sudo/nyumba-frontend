// components/properties/ErrorDisplay.jsx
import React from 'react';
import { Database, Lock, AlertCircle, WifiOff, Wifi, RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ errorType, onRetry, retryCount = 0, laravelApiBase }) => {
  const errorConfigs = {
    'API_NOT_FOUND': {
      icon: <Database className="w-12 h-12 text-red-400" />,
      title: 'Service Unavailable',
      message: 'The property listing service is currently unavailable. Please check if the Laravel backend is running.',
      suggestion: 'Ensure your Laravel server is running on http://localhost:8000',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      suggestionColor: 'text-red-600',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700'
    },
    'HTTP_401': {
      icon: <Lock className="w-12 h-12 text-red-400" />,
      title: 'Authentication Required',
      message: 'You need to be authenticated to access property listings.',
      suggestion: 'Please log in to your account and try again.',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      suggestionColor: 'text-red-600',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700'
    },
    'HTTP_500': {
      icon: <AlertCircle className="w-12 h-12 text-orange-400" />,
      title: 'Server Error',
      message: 'The Laravel backend server encountered an error while processing your request.',
      suggestion: 'Check the Laravel server logs for more details. This is usually temporary.',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      titleColor: 'text-orange-800',
      messageColor: 'text-orange-700',
      suggestionColor: 'text-orange-600',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700'
    },
    'HTTP_403': {
      icon: <Lock className="w-12 h-12 text-purple-400" />,
      title: 'Access Denied',
      message: 'You do not have permission to access property listings.',
      suggestion: 'Please check your authentication credentials or contact support.',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      titleColor: 'text-purple-800',
      messageColor: 'text-purple-700',
      suggestionColor: 'text-purple-600',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700'
    },
    'NETWORK_ERROR': {
      icon: <WifiOff className="w-12 h-12 text-gray-400" />,
      title: 'Connection Error',
      message: 'Unable to connect to the Laravel backend server. Please check your connection.',
      suggestion: 'Verify the backend server is running and your network connection is stable.',
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      titleColor: 'text-gray-800',
      messageColor: 'text-gray-700',
      suggestionColor: 'text-gray-600',
      buttonBg: 'bg-gray-600',
      buttonHover: 'hover:bg-gray-700'
    },
    'INVALID_DATA_FORMAT': {
      icon: <Database className="w-12 h-12 text-yellow-400" />,
      title: 'Data Format Error',
      message: 'The Laravel backend returned data in an unexpected format.',
      suggestion: 'This indicates a server-side issue. Please check your API endpoint response.',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      suggestionColor: 'text-yellow-600',
      buttonBg: 'bg-yellow-600',
      buttonHover: 'hover:bg-yellow-700'
    },
    'INVALID_LOCATION': {
      icon: <AlertCircle className="w-12 h-12 text-blue-400" />,
      title: 'Invalid Location',
      message: 'The location provided could not be processed.',
      suggestion: 'Please check the location format and try again.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      suggestionColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700'
    },
    'UNKNOWN_ERROR': {
      icon: <AlertCircle className="w-12 h-12 text-red-400" />,
      title: 'Unexpected Error',
      message: 'An unexpected error occurred while loading properties from the backend.',
      suggestion: 'Please try refreshing the page or check the browser console for more details.',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      suggestionColor: 'text-red-600',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700'
    }
  };

  const config = errorConfigs[errorType] || errorConfigs['UNKNOWN_ERROR'];

  return (
    <div className="text-center py-16">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-8 max-w-lg mx-auto`}>
        <div className="flex flex-col items-center">
          {config.icon}
          <h3 className={`${config.titleColor} font-bold text-xl mt-4 mb-2`}>
            {config.title}
          </h3>
          <p className={`${config.messageColor} text-sm mb-4 text-center leading-relaxed`}>
            {config.message}
          </p>
          <p className={`${config.suggestionColor} text-xs mb-6 text-center`}>
            {config.suggestion}
          </p>
          <div className="space-y-3 w-full">
            <button
              onClick={onRetry}
              className={`px-6 py-2 ${config.buttonBg} text-white rounded-lg text-sm ${config.buttonHover} transition-colors duration-200 flex items-center justify-center mx-auto`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
            </button>

            {/* Additional context for specific errors */}
            {errorType === 'NETWORK_ERROR' && (
              <div className="flex items-center justify-center text-xs text-gray-500">
                <Wifi className="w-4 h-4 mr-1" />
                Check Laravel server status
              </div>
            )}

            {(errorType === 'API_NOT_FOUND' || errorType === 'HTTP_500') && laravelApiBase && (
              <div className="text-xs text-gray-500 mt-2 break-all">
                Backend URL: {laravelApiBase}/api/tenant/properties/location
              </div>
            )}

            {errorType === 'HTTP_401' && (
              <div className="text-xs text-gray-500 mt-2">
                Check your login credentials and try again
              </div>
            )}

            {errorType === 'INVALID_DATA_FORMAT' && (
              <div className="text-xs text-gray-500 mt-2">
                Expected: Array of property objects
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
