//combined functionality to post in both statuses and booking tables
"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import axios from "@/lib/axios";

const BookingCard = ({ property, propertyId }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [propertyStatus, setPropertyStatus] = useState(property?.status || null);
  const [statusLoading, setStatusLoading] = useState(false);

  const isPropertyUnavailable =
    propertyStatus === "unavailable" || propertyStatus === "rented" || propertyStatus === "maintenance";

  // ✅ Fetch latest property status
  const checkPropertyStatus = async () => {
    setStatusLoading(true);
    try {
      const response = await axios.get(`/api/property-status/${propertyId}`);
      if (response.status === 200 && response.data.success) {
        const { is_booked, status } = response.data;
        setIsBooked(is_booked);
        setPropertyStatus(status);
        if (bookingMessage.includes("Failed to check")) setBookingMessage("");
      }
    } catch (err) {
      console.error("Error checking property status:", err);
      setBookingMessage(err.response?.status === 404 ? "Property not found." : "Failed to check property status.");
      setTimeout(() => setBookingMessage(""), 5000);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) checkPropertyStatus();
  }, [propertyId]);

  // ✅ Handle combined booking
  const handleBookNow = async () => {
    if (isBooking || statusLoading) return;

    setIsBooking(true);
    setBookingMessage("");

    try {
      // Step 1: Fetch latest status
      await checkPropertyStatus();

      // Step 2: Prevent double booking
      if (propertyStatus === "booked") {
        setBookingMessage("This property is already booked.");
        return;
      }
      if (isPropertyUnavailable) {
        setBookingMessage(`This property is currently ${propertyStatus} and cannot be booked.`);
        return;
      }

      // Step 3: Update status table to 'booked'
      const statusResponse = await axios.post("/api/status/update", {
        property_id: parseInt(propertyId),
        status: "booked",
      });

      if (!(statusResponse.status === 200 && statusResponse.data.success)) {
        setBookingMessage(statusResponse.data.message || "Failed to update property status.");
        return;
      }

      setPropertyStatus("booked"); // update local status

      // Step 4: POST to bookings table
      const bookingResponse = await axios.post("/api/tenant/bookings", {
        property_id: parseInt(propertyId),
        status: "booked", // use updated status
      });

      if (bookingResponse.status === 200 && bookingResponse.data.success) {
        setIsBooked(true);
        setBookingMessage(bookingResponse.data.message || "Property booked successfully!");
      } else {
        setBookingMessage(bookingResponse.data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Error during booking:", err);
      if (err.response) {
        if (err.response.status === 422) {
          setBookingMessage(err.response.data.message || "This property is already booked.");
        } else {
          setBookingMessage(err.response.data.message || "Booking failed.");
        }
      } else {
        setBookingMessage("Network error. Please try again.");
      }
    } finally {
      setIsBooking(false);
      setTimeout(() => setBookingMessage(""), 5000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Book This Property</h3>
        <button
          onClick={checkPropertyStatus}
          disabled={statusLoading}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Status Indicator */}
      {propertyStatus && (
        <div
          className={`mb-4 p-2 rounded-lg text-xs ${
            propertyStatus === "available" || propertyStatus === "vacant"
              ? "bg-green-50 text-green-700 border border-green-200"
              : propertyStatus === "booked"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          Status: {propertyStatus.charAt(0).toUpperCase() + propertyStatus.slice(1)}
        </div>
      )}

      {/* Booking Messages */}
      {bookingMessage && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
            isBooked || bookingMessage.includes("success")
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {isBooked || bookingMessage.includes("success") ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {bookingMessage}
        </div>
      )}

      {/* Price */}
      <div className="mb-6">
        <div className="text-2xl font-bold text-blue-600 mb-2">
          MKW{" "}
          {typeof property?.price === "number"
            ? property.price.toLocaleString()
            : property?.price || "N/A"}
          <span className="text-lg text-gray-600 font-normal">/month</span>
        </div>
        <p className="text-gray-500 text-sm">Security deposit may be required</p>
      </div>

      {/* Booking Button */}
      {isPropertyUnavailable ? (
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">Property Unavailable</p>
          <p className="text-gray-500 text-sm">This property is currently {propertyStatus}</p>
          <button
            onClick={checkPropertyStatus}
            disabled={statusLoading}
            className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 inline ${statusLoading ? "animate-spin" : ""}`} />
            Check Status
          </button>
        </div>
      ) : (
        <button
          onClick={handleBookNow}
          disabled={isBooking || statusLoading || isBooked}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
            isBooked ? "bg-red-600 text-white hover:bg-red-700" : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBooking ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : statusLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              {isBooked ? "Cancel Booking" : "Book Now"}
            </>
          )}
        </button>
      )}

      <p className="text-gray-500 text-xs mt-3 text-center">
        By booking, you agree to the terms and conditions
      </p>
    </div>
  );
};

export default BookingCard;

