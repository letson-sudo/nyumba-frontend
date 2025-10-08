// contexts/SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createApiClient, handleApiError } from '../tenant/utils/apiUtils';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState({
    premium: { name: 'Premium', price: 999.00 },
    basic: { name: 'Basic', price: 499.00 }
  });

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError('');

      const apiClient = createApiClient();

      // Use shorter timeout and add retry logic
      const response = await apiClient.get('/api/subscriptions/status', {
        withCredentials: true,
        timeout: 10000, // Reduced from 30000ms to 10000ms
      });

      console.log('Subscription status response:', response.data);

      if (response.data?.status === 'success') {
        const subscription = response.data.subscription;
        const isActive = response.data.is_subscribed || false;
        const status = response.data.subscription_status || 'none';

        setSubscriptionData(subscription);
        setIsSubscribed(isActive);
        setSubscriptionStatus(status);

        if (subscription?.days_remaining !== undefined) {
          setDaysRemaining(subscription.days_remaining);
        } else {
          setDaysRemaining(0);
        }
      } else {
        // Set defaults for unsuccessful response
        resetToDefaults();
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);

      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout. Please check your internet connection.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        handleApiError(error, setError);
      }

      // Set defaults on error
      resetToDefaults();
    } finally {
      setLoading(false);
    }
  };

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get('/api/subscriptions/plans', {
        withCredentials: true,
        timeout: 10000,
      });

      if (response.data?.status === 'success' && response.data?.plans) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      // Keep default plans on error
    }
  };

  // Reset to default values
  const resetToDefaults = () => {
    setSubscriptionData(null);
    setIsSubscribed(false);
    setSubscriptionStatus('none');
    setDaysRemaining(0);
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscriptionStatus();
  };

  // Handle subscription success
  const handleSubscriptionSuccess = (paymentData) => {
    // Immediately update to processing state
    if (paymentData?.subscription_id) {
      setSubscriptionStatus('processing');
      setIsSubscribed(false); // Keep false until confirmed
    }

    // Refresh data from server
    setTimeout(() => {
      refreshSubscription();
    }, 1000);
  };

  // Check if user has active access
  const hasActiveAccess = () => {
    return isSubscribed && subscriptionStatus === 'active' && daysRemaining > 0;
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.allSettled([
        fetchSubscriptionStatus(),
        fetchPlans()
      ]);
    };

    initializeData();
  }, []);

  const contextValue = {
    // State
    subscriptionData,
    isSubscribed,
    subscriptionStatus,
    daysRemaining,
    loading,
    error,
    plans,

    // Methods
    refreshSubscription,
    handleSubscriptionSuccess,
    hasActiveAccess,

    // Derived state
    isActive: hasActiveAccess(),
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
