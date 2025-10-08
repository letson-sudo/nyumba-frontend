import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { createApiClient, handleApiError } from './utils/apiUtils';

const SubscriptionPrompt = ({ userId, onSubscribe }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [plans, setPlans] = useState({});
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptionStatus();
    fetchPlans();
  }, [userId]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const apiClient = createApiClient();
      const response = await apiClient.get('/api/subscriptions/status', {
        withCredentials: true,
      });

      console.log('Subscription status response:', response.data);

      if (response.data?.status === 'success') {
        const subscription = response.data.subscription;
        setSubscriptionData(subscription);
        setIsSubscribed(response.data.is_subscribed || false);
        setSubscriptionStatus(response.data.subscription_status || 'none');
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      handleApiError(error, setError);
      // Set defaults on error
      setIsSubscribed(false);
      setSubscriptionStatus('none');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get('/api/subscriptions/plans', {
        withCredentials: true,
      });

      console.log('Plans response:', response.data);

      if (response.data?.status === 'success' && response.data?.plans) {
        setPlans(response.data.plans);
      } else if (response.data?.plans) {
        setPlans(response.data.plans);
      } else {
        // Fallback to default plans
        setPlans({
          premium: { name: 'Premium', price: 999.00 },
          basic: { name: 'Basic', price: 499.00 }
        });
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      // Set default plans on error
      setPlans({
        premium: { name: 'Premium', price: 999.00 },
        basic: { name: 'Basic', price: 499.00 }
      });
    }
  };

  const handleSubscribeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (subscriptionData) => {
    // Refresh subscription status
    fetchSubscriptionStatus();

    // Call the parent component's callback
    if (onSubscribe) {
      onSubscribe(subscriptionData);
    }
    setShowPaymentModal(false);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-100 p-6 rounded-xl shadow-lg mb-6 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user has an active subscription, show watermark
  if (isSubscribed && subscriptionStatus === 'active') {
    return (
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 rounded-xl shadow-lg mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-yellow-300" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-semibold">Subscribed</span>
                <p className="text-green-100 text-sm">
                  {subscriptionData?.plan_name} Plan
                  {subscriptionData?.end_date && (
                    <span className="ml-2">
                      • Expires {formatDate(subscriptionData.end_date)}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right text-sm text-green-100">
                {subscriptionData?.days_remaining !== undefined && (
                  <p>{subscriptionData.days_remaining} days remaining</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If subscription is processing, show processing state
  if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') {
    return (
      <div className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-yellow-300 animate-pulse" />
          <div>
            <h3 className="text-lg font-bold">Subscription Processing</h3>
            <p className="text-yellow-100 text-sm">
              Your payment is being processed. You'll be notified once it's complete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription prompt for non-subscribed users
  return (
    <>
      {/* Subscription Prompt Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-300" />
            <div>
              <h3 className="text-xl font-bold">Upgrade to Premium</h3>
              <p className="text-blue-100">Access premium listings and features</p>
            </div>
          </div>
          <button
            onClick={handleSubscribeClick}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Subscribe Now
          </button>
        </div>

        {Object.keys(plans).length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plans).map(([key, plan]) => (
              <div key={key} className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{plan.name} Plan</h4>
                    <p className="text-sm text-blue-100">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-sm text-blue-100">/month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          plans={plans}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </>
  );
};

export default SubscriptionPrompt;

