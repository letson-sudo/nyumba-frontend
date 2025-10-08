// components/properties/SubscriptionOverlay.jsx
import React from 'react';
import { Lock, Clock, AlertTriangle, RefreshCw, CreditCard } from 'lucide-react';

const SubscriptionOverlay = ({
  subscriptionStatus,
  daysRemaining = 0,
  isSubscribed = false,
  onUpgrade,
  onRenew
}) => {
  const getOverlayConfig = () => {
    // Not subscribed at all
    if (!isSubscribed) {
      return {
        icon: <Lock className="w-8 h-8 mx-auto mb-2" />,
        title: "Premium Feature",
        message: "Subscribe to unlock property details",
        subMessage: "Access property images, contact info, and booking features",
        buttonText: "Subscribe Now",
        buttonAction: onUpgrade,
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        overlayColor: "bg-gray-900/70"
      };
    }

    // Subscription processing/pending
    if (subscriptionStatus === 'processing' || subscriptionStatus === 'pending') {
      return {
        icon: <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />,
        title: "Processing Payment",
        message: "Your subscription is being activated",
        subMessage: "This usually takes a few minutes. Please wait...",
        buttonText: null, // No button during processing
        buttonAction: null,
        buttonColor: "",
        overlayColor: "bg-blue-900/70"
      };
    }

    // Subscription expired (active but 0 days remaining)
    if (subscriptionStatus === 'active' && daysRemaining === 0) {
      return {
        icon: <Clock className="w-8 h-8 mx-auto mb-2 text-orange-400" />,
        title: "Subscription Expired",
        message: "Your premium access has ended",
        subMessage: "Renew now to continue accessing property details",
        buttonText: "Renew Subscription",
        buttonAction: onRenew,
        buttonColor: "bg-orange-600 hover:bg-orange-700",
        overlayColor: "bg-orange-900/70"
      };
    }

    // Subscription canceled
    if (subscriptionStatus === 'canceled' || subscriptionStatus === 'cancelled') {
      return {
        icon: <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />,
        title: "Subscription Canceled",
        message: "Your premium access has been canceled",
        subMessage: "Subscribe again to access property details",
        buttonText: "Reactivate Subscription",
        buttonAction: onUpgrade,
        buttonColor: "bg-red-600 hover:bg-red-700",
        overlayColor: "bg-red-900/70"
      };
    }

    // Failed payment or other issues
    if (subscriptionStatus === 'failed' || subscriptionStatus === 'incomplete') {
      return {
        icon: <CreditCard className="w-8 h-8 mx-auto mb-2 text-yellow-400" />,
        title: "Payment Issue",
        message: "There's an issue with your subscription payment",
        subMessage: "Please update your payment method to continue",
        buttonText: "Update Payment",
        buttonAction: onRenew,
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        overlayColor: "bg-yellow-900/70"
      };
    }

    // Default fallback
    return {
      icon: <Lock className="w-8 h-8 mx-auto mb-2" />,
      title: "Access Restricted",
      message: "Premium subscription required",
      subMessage: "Upgrade to unlock all property features",
      buttonText: "Subscribe",
      buttonAction: onUpgrade,
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      overlayColor: "bg-gray-900/70"
    };
  };

  const config = getOverlayConfig();

  return (
    <div className={`absolute inset-0 ${config.overlayColor} z-10 rounded-xl flex items-center justify-center backdrop-blur-sm`}>
      <div className="text-center text-white p-6 max-w-xs">
        {config.icon}

        <h3 className="text-lg font-semibold mb-2">
          {config.title}
        </h3>

        <p className="text-sm font-medium mb-1">
          {config.message}
        </p>

        {config.subMessage && (
          <p className="text-xs text-gray-300 mb-4 leading-relaxed">
            {config.subMessage}
          </p>
        )}

        {/* Days remaining warning for active subscriptions nearing expiry */}
        {subscriptionStatus === 'active' && daysRemaining > 0 && daysRemaining <= 3 && (
          <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-2 mb-4">
            <p className="text-xs text-orange-200">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Action button */}
        {config.buttonText && config.buttonAction && (
          <button
            onClick={config.buttonAction}
            className={`px-4 py-2 ${config.buttonColor} text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm`}
          >
            {config.buttonText}
          </button>
        )}

        {/* Processing status indicator */}
        {(subscriptionStatus === 'processing' || subscriptionStatus === 'pending') && (
          <div className="mt-4">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-xs text-blue-200 mt-2">
              Processing... Please don't refresh the page
            </p>
          </div>
        )}

        {/* Additional context based on status */}
        {subscriptionStatus === 'failed' && (
          <div className="mt-3 text-xs text-yellow-200">
            Error code: Payment failed - check your payment method
          </div>
        )}

        {subscriptionStatus === 'incomplete' && (
          <div className="mt-3 text-xs text-yellow-200">
            Subscription setup incomplete - action required
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionOverlay;
