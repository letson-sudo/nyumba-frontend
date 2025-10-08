import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { createApiClient, handleApiError, refreshCsrfToken } from './utils/apiUtils';

const PaymentModal = ({ plans, onPaymentSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    bankAccount: '',
    bankName: '',
    accountHolder: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize CSRF token when modal opens
  useEffect(() => {
    initializeCsrfToken();
  }, []);

  const initializeCsrfToken = async () => {
    try {
      await refreshCsrfToken();
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Handle different input scenarios
    if (digits.length === 9) {
      return `+265${digits}`;
    } else if (digits.length === 12 && digits.startsWith('265')) {
      return `+${digits}`;
    } else if (digits.length > 12 && digits.startsWith('265')) {
      return `+${digits.substring(0, 12)}`;
    }

    return value;
  };

  const validateMobileNumber = (number) => {
    // Must match +265xxxxxxxxx format exactly
    const phoneRegex = /^\+265[0-9]{9}$/;
    return phoneRegex.test(number);
  };

  const validateBankDetails = () => {
    if (!paymentDetails.bankName) return 'Bank name is required';
    if (!paymentDetails.bankAccount) return 'Bank account number is required';
    if (!paymentDetails.accountHolder) return 'Account holder name is required';
    if (paymentDetails.bankAccount.length < 8) return 'Bank account number seems too short';
    return null;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Client-side validation
      if (paymentMethod === 'mobile') {
        if (!paymentDetails.mobileNumber) {
          setError('Mobile number is required');
          return;
        }

        if (!validateMobileNumber(paymentDetails.mobileNumber)) {
          setError('Please enter a valid Malawian mobile number (+265xxxxxxxxx)');
          return;
        }
      } else {
        const bankValidationError = validateBankDetails();
        if (bankValidationError) {
          setError(bankValidationError);
          return;
        }
      }

      // Prepare payment data
      const paymentData = {
        plan: selectedPlan,
        payment_method: paymentMethod,
      };

      if (paymentMethod === 'mobile') {
        paymentData.mobile_number = paymentDetails.mobileNumber;
      } else {
        paymentData.bank_name = paymentDetails.bankName;
        paymentData.bank_account = paymentDetails.bankAccount;
        paymentData.account_holder = paymentDetails.accountHolder;
      }

      console.log('Submitting payment data:', paymentData);

      const apiClient = createApiClient();
      const response = await apiClient.post('/api/subscriptions/payment', paymentData, {
        withCredentials: true, // Ensure session cookies are sent
      });

      console.log('Payment response:', response.data);

      if (response.data?.status === 'success') {
        setSuccess('Payment initiated successfully! Please complete the payment on your mobile device.');

        // Call the success callback
        if (onPaymentSuccess) {
          onPaymentSuccess({
            subscriptionId: response.data.subscription_id,
            transactionId: response.data.transaction_id,
            status: response.data.subscription_status || 'processing'
          });
        }

        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 3000);

      } else {
        setError(response.data?.message || 'Payment initiation failed');
      }

    } catch (error) {
      console.error('Payment submission error:', error);
      handleApiError(error, setError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setError('');
    setSuccess('');
    setPaymentDetails({
      mobileNumber: '',
      bankAccount: '',
      bankName: '',
      accountHolder: ''
    });
    onClose();
  };

  const handleMobileNumberChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('mobileNumber', formatted);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Subscribe to Premium</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
              disabled={isProcessing}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plan Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Plan
            </label>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={selectedPlan === key}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="text-blue-600"
                    disabled={isProcessing}
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-sm text-gray-500 ml-2">Monthly</span>
                    </div>
                    <span className="font-bold text-blue-600">{formatCurrency(plan.price)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile"
                  checked={paymentMethod === 'mobile'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                  disabled={isProcessing}
                />
                <Smartphone className="h-5 w-5 text-gray-400" />
                <span>Mobile Money (Airtel/TNM)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                  disabled={isProcessing}
                />
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentMethod === 'mobile' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={paymentDetails.mobileNumber}
                    onChange={(e) => handleMobileNumberChange(e.target.value)}
                    placeholder="+265999123456"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your Airtel or TNM mobile number
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="e.g., Standard Bank"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    placeholder="Enter your account number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                    placeholder="Full name as on bank account"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  Subscribe for {formatCurrency(plans[selectedPlan]?.price || 0)}
                </span>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Your subscription will auto-renew monthly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
