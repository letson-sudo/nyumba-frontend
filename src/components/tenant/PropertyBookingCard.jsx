import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Shield,
  TrendingUp,
  Zap,
  Gift,
  Sparkles,
  Home,
  RefreshCw
} from "lucide-react";

const PropertyBookingCard = ({ property, propertyId, apiBase }) => {
  const [moveInDate, setMoveInDate] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("12");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState(property?.status || null);
  const [statusLoading, setStatusLoading] = useState(false);

  if (!property) return null;

  const isPropertyUnavailable =
    propertyStatus === "unavailable" || propertyStatus === "rented" || propertyStatus === "maintenance";

  const monthlyRent = typeof property?.price === "number"
    ? property.price
    : (property?.price || 0);
  const securityDeposit = typeof monthlyRent === "number" ? monthlyRent : 0;
  const totalUpfront = (typeof monthlyRent === "number" ? monthlyRent : 0) + securityDeposit;

  // Fetch latest property status
  const checkPropertyStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/property-status/${propertyId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const { is_booked, status } = data;
          setIsBooked(is_booked);
          setPropertyStatus(status);
          if (errorMessage.includes("Failed to check")) setErrorMessage("");
        }
      }
    } catch (err) {
      console.error("Error checking property status:", err);
      setErrorMessage("Failed to check property status.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) checkPropertyStatus();
  }, [propertyId]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!moveInDate) {
      setErrorMessage("Please select a move-in date");
      return;
    }

    if (isSubmitting || statusLoading) return;

    setIsSubmitting(true);
    setBookingStatus(null);
    setErrorMessage("");

    try {
      // Step 1: Fetch latest status
      await checkPropertyStatus();

      // Step 2: Prevent double booking
      if (propertyStatus === "booked") {
        setErrorMessage("This property is already booked.");
        setIsSubmitting(false);
        return;
      }
      if (isPropertyUnavailable) {
        setErrorMessage(`This property is currently ${propertyStatus} and cannot be booked.`);
        setIsSubmitting(false);
        return;
      }

      // Step 3: Update status table to 'booked'
      const statusResponse = await fetch(`${apiBase}/api/status/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          property_id: parseInt(propertyId),
          status: "booked",
        }),
      });

      const statusData = await statusResponse.json();

      if (!(statusResponse.ok && statusData.success)) {
        setErrorMessage(statusData.message || "Failed to update property status.");
        setIsSubmitting(false);
        return;
      }

      setPropertyStatus("booked");

      // Step 4: POST to bookings table with move-in date and lease duration
      const bookingResponse = await fetch(
        `${apiBase}/api/tenant/properties/${propertyId}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            move_in_date: moveInDate,
            lease_duration: parseInt(leaseDuration, 10),
            property_id: parseInt(propertyId),
            status: "booked",
          }),
        }
      );

      const bookingData = await bookingResponse.json();

      if (bookingResponse.ok && bookingData.success) {
        setIsBooked(true);
        setBookingStatus("success");
        setMoveInDate("");
        setLeaseDuration("12");
      } else {
        setErrorMessage(bookingData.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      if (error.response) {
        if (error.response.status === 422) {
          setErrorMessage("This property is already booked.");
        } else {
          setErrorMessage(error.response.data?.message || "Booking failed.");
        }
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setErrorMessage("");
        setBookingStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="max-w-md w-full">
      {/* Outer glow container */}
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-60 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>

        {/* Main card */}
        <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          {/* Header with icon and refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reserve Your Home
                </h2>
                <p className="text-sm text-gray-500">Secure your spot today</p>
              </div>
            </div>
            <button
              onClick={checkPropertyStatus}
              disabled={statusLoading}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              title="Refresh status"
            >
              <RefreshCw className={`w-5 h-5 ${statusLoading ? "animate-spin text-blue-600" : ""}`} />
            </button>
          </div>

          {/* Status Indicator */}
          {propertyStatus && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                propertyStatus === "available" || propertyStatus === "vacant"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                  : propertyStatus === "booked"
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200"
                  : "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  propertyStatus === "available" || propertyStatus === "vacant"
                    ? "bg-green-500"
                    : propertyStatus === "booked"
                    ? "bg-blue-500"
                    : "bg-red-500"
                } animate-pulse`}></div>
                Status: {propertyStatus.charAt(0).toUpperCase() + propertyStatus.slice(1)}
              </div>
            </div>
          )}

          {/* Status messages */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </p>
            </div>
          )}

          {bookingStatus === "success" && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Booking successful! Your journey begins.
              </p>
            </div>
          )}

          {/* Property Unavailable State */}
          {isPropertyUnavailable ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">Property Unavailable</p>
              <p className="text-gray-600 text-sm mb-6">
                This property is currently {propertyStatus}
              </p>
              <button
                onClick={checkPropertyStatus}
                disabled={statusLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`} />
                Check Status
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <div className="space-y-5">
                {/* Move-in date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Move-In Date
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all hover:border-gray-300"
                  />
                </div>

                {/* Lease duration */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4 text-purple-500" />
                    Lease Duration
                  </label>
                  <select
                    value={leaseDuration}
                    onChange={(e) => setLeaseDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all appearance-none cursor-pointer hover:border-gray-300"
                  >
                    {[6, 12, 18, 24].map((m) => (
                      <option key={m} value={m}>
                        {m} months
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-3 p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Monthly Rent
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      MKW {typeof monthlyRent === "number" ? monthlyRent.toLocaleString() : monthlyRent || "N/A"}
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      Security Deposit
                    </span>
                    <span className="text-gray-900 font-semibold">
                      MKW {typeof securityDeposit === "number" ? securityDeposit.toLocaleString() : securityDeposit || "N/A"}
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-700 font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-500" />
                      Total Due Today
                    </span>
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent font-bold text-2xl">
                      MKW {typeof totalUpfront === "number" ? totalUpfront.toLocaleString() : totalUpfront || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Perks banner */}
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <Gift className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">
                    First month move-in special available
                  </p>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleBooking}
                  disabled={isSubmitting || statusLoading || isBooked}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-base transition-all duration-300 transform shadow-lg hover:shadow-xl ${
                    isBooked
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 cursor-default"
                      : "bg-gradient-to-r from-blue-500  to-cyan-500 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 hover:scale-105 active:scale-95"
                  } disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Processing...
                      </>
                    ) : statusLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Checking...
                      </>
                    ) : isBooked ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Booking Confirmed
                      </>
                    ) : (
                      <>
                        Secure Your Booking
                        <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  {!isBooked && !isSubmitting && !statusLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-purple-500" />
                <span>Verified</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-500" />
                <span>Instant</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-3 text-center">
              By booking, you agree to the terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyBookingCard;
