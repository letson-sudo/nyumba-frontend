

// "use client";
// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   CreditCard,
//   Smartphone,
//   Building2,
//   ArrowLeft,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   RefreshCw,
//   Phone,
//   User,
// } from "lucide-react";
// import api from "@/lib/axios";

// const handleApiError = (error, setError) => {
//   let msg = "Something went wrong. Please try again.";
//   if (error.response) {
//     msg = error.response.data?.message || msg;
//   } else if (error.request) {
//     msg = "No response from server. Please check your network.";
//   }
//   if (setError) setError(msg);
// };

// const PaymentPage = () => {
//   const { id: propertyId } = useParams();
//   const router = useRouter();

//   const [currentStep, setCurrentStep] = useState("select");
//   const [selectedMethod, setSelectedMethod] = useState("");
//   const [paymentData, setPaymentData] = useState({
//     amount: "250000",
//     phone_number: "",
//     card_number: "",
//     cardholder_name: "",
//     expiry_date: "",
//     cvv: "",
//   });

//   const [paymentState, setPaymentState] = useState({
//     isProcessing: false,
//     currentPayment: null,
//     error: null,
//     success: false,
//     statusPolling: null,
//   });

//   const paymentMethods = [
//     {
//       id: "airtel_money",
//       name: "Airtel Money",
//       icon: <Smartphone className="w-8 h-8" />,
//       description: "Pay using your Airtel Money account",
//       color: "from-red-500 to-red-600",
//       requiresPhone: true,
//     },
//     {
//       id: "tnm_mpamba",
//       name: "TNM Mpamba",
//       icon: <Smartphone className="w-8 h-8" />,
//       description: "Pay using your TNM Mpamba account",
//       color: "from-blue-500 to-blue-600",
//       requiresPhone: true,
//     },
//     {
//       id: "visa",
//       name: "Visa Card",
//       icon: <CreditCard className="w-8 h-8" />,
//       description: "Pay using your Visa credit/debit card",
//       color: "from-indigo-500 to-indigo-600",
//       requiresCard: true,
//     },
//     {
//       id: "mastercard",
//       name: "Mastercard",
//       icon: <CreditCard className="w-8 h-8" />,
//       description: "Pay using your Mastercard credit/debit card",
//       color: "from-orange-500 to-orange-600",
//       requiresCard: true,
//     },
//     {
//       id: "bank_transfer",
//       name: "Bank Transfer",
//       icon: <Building2 className="w-8 h-8" />,
//       description: "Pay via direct bank transfer",
//       color: "from-green-500 to-green-600",
//       requiresBank: true,
//     },
//   ];

//   // Cleanup polling on unmount
//   useEffect(() => {
//     return () => {
//       if (paymentState.statusPolling) {
//         clearInterval(paymentState.statusPolling);
//       }
//     };
//   }, [paymentState.statusPolling]);

//   const initiatePayment = async () => {
//     try {
//       setPaymentState((prev) => ({ ...prev, isProcessing: true, error: null }));
//       setCurrentStep("processing");

//       const mockBookingId = Math.floor(Math.random() * 1000) + 1;

//       const payloadData = {
//         booking_id: mockBookingId,
//         amount: parseFloat(paymentData.amount),
//         payment_method: selectedMethod,
//         currency: "MWK",
//       };

//       const method = paymentMethods.find((m) => m.id === selectedMethod);
//       if (method?.requiresPhone) {
//         payloadData.phone_number = paymentData.phone_number;
//       } else if (method?.requiresCard) {
//         Object.assign(payloadData, {
//           card_number: paymentData.card_number,
//           cardholder_name: paymentData.cardholder_name,
//           expiry_date: paymentData.expiry_date,
//           cvv: paymentData.cvv,
//         });
//       }

//       const response = await api.post("/api/payments/initiate", payloadData);
//       const result = response.data;

//       if (result.success) {
//         setPaymentState((prev) => ({
//           ...prev,
//           isProcessing: false,
//           currentPayment: result.data,
//         }));

//         startStatusPolling(result.data.transaction_ref);
//       } else {
//         setPaymentState((prev) => ({
//           ...prev,
//           isProcessing: false,
//           error: result.message || "Payment initiation failed",
//         }));
//         setCurrentStep("result");
//       }
//     } catch (error) {
//       handleApiError(error, (msg) =>
//         setPaymentState((prev) => ({ ...prev, error: msg }))
//       );
//       setPaymentState((prev) => ({ ...prev, isProcessing: false }));
//       setCurrentStep("result");
//     }
//   };

//   const startStatusPolling = (transactionRef) => {
//     const pollInterval = setInterval(async () => {
//       try {
//         const response = await api.get(`/api/payments/status/${transactionRef}`);
//         const result = response.data;

//         if (result.success) {
//           const payment = result.data;

//           setPaymentState((prev) => ({
//             ...prev,
//             currentPayment: { ...prev.currentPayment, ...payment },
//           }));

//           if (payment.status === "success") {
//             clearInterval(pollInterval);
//             setPaymentState((prev) => ({ ...prev, success: true }));
//             setCurrentStep("result");
//           } else if (
//             payment.status === "failed" ||
//             payment.status === "canceled"
//           ) {
//             clearInterval(pollInterval);
//             setPaymentState((prev) => ({
//               ...prev,
//               error: `Payment ${payment.status}. Please try again.`,
//             }));
//             setCurrentStep("result");
//           }
//         }
//       } catch (error) {
//         console.error("Status polling error:", error);
//       }
//     }, 3000);

//     setPaymentState((prev) => ({ ...prev, statusPolling: pollInterval }));

//     // Timeout safeguard
//     setTimeout(() => {
//       clearInterval(pollInterval);
//       if (paymentState.currentPayment?.status === "processing") {
//         setPaymentState((prev) => ({
//           ...prev,
//           error:
//             "Payment timeout. Please check your payment status or try again.",
//         }));
//         setCurrentStep("result");
//       }
//     }, 300000);
//   };

//   const renderPaymentForm = () => {
//     const method = paymentMethods.find(m => m.id === selectedMethod);

//     return (
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Amount (MWK)
//           </label>
//           <input
//             type="text"
//             value={paymentData.amount}
//             onChange={(e) => setPaymentData(prev => ({...prev, amount: e.target.value}))}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Enter amount"
//           />
//         </div>

//         {method?.requiresPhone && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Phone className="inline w-4 h-4 mr-1" />
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={paymentData.phone_number}
//               onChange={(e) => setPaymentData(prev => ({...prev, phone_number: e.target.value}))}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="e.g., +265 99 123 4567"
//             />
//           </div>
//         )}

//         {method?.requiresCard && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <User className="inline w-4 h-4 mr-1" />
//                 Cardholder Name
//               </label>
//               <input
//                 type="text"
//                 value={paymentData.cardholder_name}
//                 onChange={(e) => setPaymentData(prev => ({...prev, cardholder_name: e.target.value}))}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Full name on card"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <CreditCard className="inline w-4 h-4 mr-1" />
//                 Card Number
//               </label>
//               <input
//                 type="text"
//                 value={paymentData.card_number}
//                 onChange={(e) => setPaymentData(prev => ({...prev, card_number: e.target.value}))}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="1234 5678 9012 3456"
//                 maxLength="19"
//               />
//             </div>

//             <div className="flex space-x-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expiry Date
//                 </label>
//                 <input
//                   type="text"
//                   value={paymentData.expiry_date}
//                   onChange={(e) => setPaymentData(prev => ({...prev, expiry_date: e.target.value}))}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="MM/YY"
//                   maxLength="5"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   value={paymentData.cvv}
//                   onChange={(e) => setPaymentData(prev => ({...prev, cvv: e.target.value}))}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="123"
//                   maxLength="4"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {method?.requiresBank && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <div className="flex items-start space-x-3">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div>
//                 <h4 className="font-medium text-blue-900">Bank Transfer Instructions</h4>
//                 <p className="text-sm text-blue-700 mt-1">
//                   You will receive bank details after clicking "Proceed". Transfer the exact amount to complete your payment.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//             <div className="flex items-center">
//               <button
//                 onClick={() => router.back()}
//                 className="mr-4 p-2 hover:bg-blue-500 rounded-full transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-white" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
//                 <p className="text-blue-100 text-sm">Property ID: {propertyId}</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {/* Progress indicator */}
//             <div className="flex items-center justify-center mb-8">
//               <div className="flex items-center space-x-4">
//                 <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                   currentStep === "select" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
//                 }`}>
//                   1
//                 </div>
//                 <div className={`h-1 w-12 ${
//                   currentStep !== "select" ? "bg-blue-600" : "bg-gray-300"
//                 }`}></div>
//                 <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                   currentStep === "details" ? "bg-blue-600 text-white" :
//                   currentStep === "processing" || currentStep === "result" ? "bg-green-500 text-white" :
//                   "bg-gray-300 text-gray-600"
//                 }`}>
//                   2
//                 </div>
//                 <div className={`h-1 w-12 ${
//                   currentStep === "processing" || currentStep === "result" ? "bg-blue-600" : "bg-gray-300"
//                 }`}></div>
//                 <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                   currentStep === "processing" ? "bg-blue-600 text-white animate-pulse" :
//                   currentStep === "result" ? "bg-green-500 text-white" :
//                   "bg-gray-300 text-gray-600"
//                 }`}>
//                   3
//                 </div>
//               </div>
//             </div>

//             {/* Payment method selection */}
//             {currentStep === "select" && (
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Payment Method</h2>
//                 <p className="text-gray-600 mb-6">Select your preferred payment method to continue</p>

//                 <div className="grid gap-4">
//                   {paymentMethods.map((method) => (
//                     <button
//                       key={method.id}
//                       onClick={() => setSelectedMethod(method.id)}
//                       className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
//                         selectedMethod === method.id
//                           ? "border-blue-500 bg-blue-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-sm`}>
//                           {method.icon}
//                         </div>
//                         <div className="flex-1">
//                           <div className="font-semibold text-gray-900">{method.name}</div>
//                           <div className="text-sm text-gray-600 mt-1">{method.description}</div>
//                         </div>
//                         {selectedMethod === method.id && (
//                           <CheckCircle className="w-6 h-6 text-blue-600" />
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 {selectedMethod && (
//                   <button
//                     onClick={() => setCurrentStep("details")}
//                     className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
//                   >
//                     Continue to Payment Details
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Payment details form */}
//             {currentStep === "details" && (
//               <div>
//                 <div className="flex items-center space-x-3 mb-6">
//                   <div className={`p-2 rounded-lg bg-gradient-to-r ${
//                     paymentMethods.find(m => m.id === selectedMethod)?.color
//                   } text-white`}>
//                     {paymentMethods.find(m => m.id === selectedMethod)?.icon}
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
//                     <p className="text-gray-600">
//                       {paymentMethods.find(m => m.id === selectedMethod)?.name}
//                     </p>
//                   </div>
//                 </div>

//                 {paymentState.error && (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                     <div className="flex items-start space-x-3">
//                       <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-medium text-red-900">Payment Error</h4>
//                         <p className="text-sm text-red-700 mt-1">{paymentState.error}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {renderPaymentForm()}

//                 <div className="flex space-x-4 mt-8">
//                   <button
//                     onClick={() => {
//                       setCurrentStep("select");
//                       setPaymentState(prev => ({ ...prev, error: null }));
//                     }}
//                     className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={initiatePayment}
//                     disabled={paymentState.isProcessing}
//                     className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
//                   >
//                     {paymentState.isProcessing ? "Processing..." : "Pay Now"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Processing state */}
//             {currentStep === "processing" && (
//               <div className="text-center py-12">
//                 <div className="relative">
//                   <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
//                   <Clock className="w-6 h-6 text-blue-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
//                 <p className="text-gray-600 mb-4">Please wait while we securely process your payment...</p>
//                 {paymentState.currentPayment && (
//                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
//                     <p className="text-sm text-gray-600">
//                       Transaction Reference: <span className="font-mono font-medium">
//                         {paymentState.currentPayment.transaction_ref}
//                       </span>
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Result state */}
//             {currentStep === "result" && (
//               <div className="text-center py-12">
//                 {paymentState.success ? (
//                   <div>
//                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <CheckCircle className="w-12 h-12 text-green-600" />
//                     </div>
//                     <h2 className="text-2xl font-semibold text-green-700 mb-2">Payment Successful!</h2>
//                     <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
//                     {paymentState.currentPayment && (
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto mb-6">
//                         <p className="text-sm text-green-700">
//                           Transaction ID: <span className="font-mono font-medium">
//                             {paymentState.currentPayment.transaction_ref}
//                           </span>
//                         </p>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => router.push(`/properties/${propertyId}`)}
//                       className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg"
//                     >
//                       Return to Property
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <XCircle className="w-12 h-12 text-red-600" />
//                     </div>
//                     <h2 className="text-2xl font-semibold text-red-700 mb-2">Payment Failed</h2>
//                     <p className="text-gray-600 mb-6">{paymentState.error}</p>
//                     <div className="flex space-x-4 justify-center">
//                       <button
//                         onClick={() => {
//                           setCurrentStep("select");
//                           setSelectedMethod("");
//                           setPaymentState(prev => ({
//                             ...prev,
//                             error: null,
//                             success: false,
//                             currentPayment: null
//                           }));
//                         }}
//                         className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
//                       >
//                         Try Again
//                       </button>
//                       <button
//                         onClick={() => router.back()}
//                         className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;



"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Building2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Phone,
  User,
} from "lucide-react";
import api from "@/lib/axios";

const handleApiError = (error, setError) => {
  let msg = "Something went wrong. Please try again.";
  if (error.response) {
    msg = error.response.data?.message || msg;
  } else if (error.request) {
    msg = "No response from server. Please check your network.";
  }
  if (setError) setError(msg);
};

const PaymentPage = () => {
  const { id: propertyId } = useParams();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState("select");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentData, setPaymentData] = useState({
    amount: "250000",
    phone_number: "",
    card_number: "",
    cardholder_name: "",
    expiry_date: "",
    cvv: "",
  });

  const [paymentState, setPaymentState] = useState({
    isProcessing: false,
    currentPayment: null,
    error: null,
    success: false,
    statusPolling: null,
  });

  const paymentMethods = [
    {
      id: "airtel_money",
      name: "Airtel Money",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Pay using your Airtel Money account",
      color: "from-red-500 to-red-600",
      requiresPhone: true,
    },
    {
      id: "tnm_mpamba",
      name: "TNM Mpamba",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Pay using your TNM Mpamba account",
      color: "from-blue-500 to-blue-600",
      requiresPhone: true,
    },
    {
      id: "visa",
      name: "Visa Card",
      icon: <CreditCard className="w-8 h-8" />,
      description: "Pay using your Visa credit/debit card",
      color: "from-indigo-500 to-indigo-600",
      requiresCard: true,
    },
    {
      id: "mastercard",
      name: "Mastercard",
      icon: <CreditCard className="w-8 h-8" />,
      description: "Pay using your Mastercard credit/debit card",
      color: "from-orange-500 to-orange-600",
      requiresCard: true,
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: <Building2 className="w-8 h-8" />,
      description: "Pay via direct bank transfer",
      color: "from-green-500 to-green-600",
      requiresBank: true,
    },
  ];

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (paymentState.statusPolling) {
        clearInterval(paymentState.statusPolling);
      }
    };
  }, [paymentState.statusPolling]);

  const initiatePayment = async () => {
    try {
      setPaymentState((prev) => ({ ...prev, isProcessing: true, error: null }));
      setCurrentStep("processing");

      const mockBookingId = Math.floor(Math.random() * 1000) + 1;

      const payloadData = {
        booking_id: mockBookingId,
        amount: parseFloat(paymentData.amount),
        payment_method: selectedMethod,
        currency: "MWK",
      };

      const method = paymentMethods.find((m) => m.id === selectedMethod);
      if (method?.requiresPhone) {
        payloadData.phone_number = paymentData.phone_number;
      } else if (method?.requiresCard) {
        Object.assign(payloadData, {
          card_number: paymentData.card_number,
          cardholder_name: paymentData.cardholder_name,
          expiry_date: paymentData.expiry_date,
          cvv: paymentData.cvv,
        });
      }

      const response = await api.post("/api/payments/initiate", payloadData);
      const result = response.data;

      if (result.success) {
        setPaymentState((prev) => ({
          ...prev,
          isProcessing: false,
          currentPayment: result.data,
        }));

        startStatusPolling(result.data.transaction_ref);
      } else {
        setPaymentState((prev) => ({
          ...prev,
          isProcessing: false,
          error: result.message || "Payment initiation failed",
        }));
        setCurrentStep("result");
      }
    } catch (error) {
      handleApiError(error, (msg) =>
        setPaymentState((prev) => ({ ...prev, error: msg }))
      );
      setPaymentState((prev) => ({ ...prev, isProcessing: false }));
      setCurrentStep("result");
    }
  };

  const startStatusPolling = (transactionRef) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get(`/api/payments/status/${transactionRef}`);
        const result = response.data;

        if (result.success) {
          const payment = result.data;

          setPaymentState((prev) => ({
            ...prev,
            currentPayment: { ...prev.currentPayment, ...payment },
          }));

          if (payment.status === "success") {
            clearInterval(pollInterval);
            setPaymentState((prev) => ({ ...prev, success: true }));
            setCurrentStep("result");
          } else if (
            payment.status === "failed" ||
            payment.status === "canceled"
          ) {
            clearInterval(pollInterval);
            setPaymentState((prev) => ({
              ...prev,
              error: `Payment ${payment.status}. Please try again.`,
            }));
            setCurrentStep("result");
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Status polling error:", error);
      }
    }, 3000);

    setPaymentState((prev) => ({ ...prev, statusPolling: pollInterval }));

    // Timeout safeguard
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentState.currentPayment?.status === "processing") {
        setPaymentState((prev) => ({
          ...prev,
          error:
            "Payment timeout. Please check your payment status or try again.",
        }));
        setCurrentStep("result");
      }
    }, 300000);
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (MWK)
          </label>
          <input
            type="text"
            value={paymentData.amount}
            onChange={(e) => setPaymentData(prev => ({...prev, amount: e.target.value}))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>

        {method?.requiresPhone && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={paymentData.phone_number}
              onChange={(e) => setPaymentData(prev => ({...prev, phone_number: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +265 99 123 4567"
            />
          </div>
        )}

        {method?.requiresCard && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Cardholder Name
              </label>
              <input
                type="text"
                value={paymentData.cardholder_name}
                onChange={(e) => setPaymentData(prev => ({...prev, cardholder_name: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full name on card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="inline w-4 h-4 mr-1" />
                Card Number
              </label>
              <input
                type="text"
                value={paymentData.card_number}
                onChange={(e) => setPaymentData(prev => ({...prev, card_number: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={paymentData.expiry_date}
                  onChange={(e) => setPaymentData(prev => ({...prev, expiry_date: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData(prev => ({...prev, cvv: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </>
        )}

        {method?.requiresBank && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Bank Transfer Instructions</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You will receive bank details after clicking "Proceed". Transfer the exact amount to complete your payment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-blue-500 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
                <p className="text-blue-100 text-sm">Property ID: {propertyId}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "select" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  1
                </div>
                <div className={`h-1 w-12 ${
                  currentStep !== "select" ? "bg-blue-600" : "bg-gray-300"
                }`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "details" ? "bg-blue-600 text-white" :
                  currentStep === "processing" || currentStep === "result" ? "bg-green-500 text-white" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  2
                </div>
                <div className={`h-1 w-12 ${
                  currentStep === "processing" || currentStep === "result" ? "bg-blue-600" : "bg-gray-300"
                }`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === "processing" ? "bg-blue-600 text-white animate-pulse" :
                  currentStep === "result" ? "bg-green-500 text-white" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  3
                </div>
              </div>
            </div>

            {/* Payment method selection */}
            {currentStep === "select" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Payment Method</h2>
                <p className="text-gray-600 mb-6">Select your preferred payment method to continue</p>

                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                        selectedMethod === method.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-sm`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedMethod && (
                  <button
                    onClick={() => setCurrentStep("details")}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
                  >
                    Continue to Payment Details
                  </button>
                )}
              </div>
            )}

            {/* Payment details form */}
            {currentStep === "details" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${
                    paymentMethods.find(m => m.id === selectedMethod)?.color
                  } text-white`}>
                    {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                    <p className="text-gray-600">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </p>
                  </div>
                </div>

                {paymentState.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Payment Error</h4>
                        <p className="text-sm text-red-700 mt-1">{paymentState.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {renderPaymentForm()}

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setCurrentStep("select");
                      setPaymentState(prev => ({ ...prev, error: null }));
                    }}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={initiatePayment}
                    disabled={paymentState.isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
                  >
                    {paymentState.isProcessing ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </div>
            )}

            {/* Processing state */}
            {currentStep === "processing" && (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
                  <Clock className="w-6 h-6 text-blue-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
                <p className="text-gray-600 mb-4">Please wait while we securely process your payment...</p>
                {paymentState.currentPayment && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
                    <p className="text-sm text-gray-600">
                      Transaction Reference: <span className="font-mono font-medium">
                        {paymentState.currentPayment.transaction_ref}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Result state */}
            {currentStep === "result" && (
              <div className="text-center py-12">
                {paymentState.success ? (
                  <div>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-green-700 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                    {paymentState.currentPayment && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto mb-6">
                        <p className="text-sm text-green-700">
                          Transaction ID: <span className="font-mono font-medium">
                            {paymentState.currentPayment.transaction_ref}
                          </span>
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => router.push(`/properties/${propertyId}`)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg"
                    >
                      Return to Property
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-red-700 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">{paymentState.error}</p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={() => {
                          setCurrentStep("select");
                          setSelectedMethod("");
                          setPaymentState(prev => ({
                            ...prev,
                            error: null,
                            success: false,
                            currentPayment: null
                          }));
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
