
//testing for subscription

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  MessageCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  createApiClient,
  handleApiError,
} from "../../../../components/tenant/utils/apiUtils";

// Custom components
import {
  SubscriptionPrompt,
  SearchAndFilter,
} from "../../../../components/tenant";
import { PropertyListContainer } from "../../../../components/tenant/HouseCard";
// import PropertyListContainer from '../../../../components/tenant/PropertyListContainer'

const NyumbaTenantDashboard = () => {
  // Subscription state
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // UI state
  const [searchLocation, setSearchLocation] = useState("");
  const [userLocation, setUserLocation] = useState("Detecting location...");
  const [activeTab, setActiveTab] = useState("browse");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Bookings/messages placeholders
  const [bookings] = useState([]);
  const [messages] = useState([]);

  /** ✅ Detect user location on mount */
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation("Lilongwe, Malawi"); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          if (data?.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state_district;
            const country = data.address.country;
            setUserLocation(`${city || "Unknown"}, ${country || ""}`);
          } else {
            setUserLocation("Lilongwe, Malawi");
          }
        } catch (err) {
          console.error("❌ Reverse geocode failed:", err);
          setUserLocation("Lilongwe, Malawi");
        }
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
        setUserLocation("Lilongwe, Malawi");
      }
    );
  }, []);

  /** ✅ Active access check */
  const hasActiveAccess = useMemo(() => {
    return (
      isSubscribed && subscriptionStatus === "active" && daysRemaining > 0
    );
  }, [isSubscribed, subscriptionStatus, daysRemaining]);

  /** ✅ Fetch subscription status */
  const fetchSubscriptionStatus = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setSubscriptionLoading(true);
      setError("");

      const LARAVEL_API_BASE =
        process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";
      const apiUrl = `${LARAVEL_API_BASE}/api/subscriptions/status`;

      const apiClient = createApiClient();
      const response = await apiClient.get(apiUrl, { withCredentials: true });

      if (response.data?.status === "success") {
        const subscription = response.data.subscription;
        setSubscriptionData(subscription);
        setIsSubscribed(response.data.is_subscribed || false);
        setSubscriptionStatus(
          response.data.subscription_status || "none"
        );
        setDaysRemaining(subscription?.days_remaining ?? 0);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("❌ Subscription fetch failed:", err);
      handleApiError(err, setError);
      if (showLoading) {
        setIsSubscribed(false);
        setSubscriptionStatus("none");
        setDaysRemaining(0);
      }
    } finally {
      if (showLoading) setLoading(false);
      setSubscriptionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  /** ✅ Handle search input */
  const handleSearchChange = useCallback((value) => {
    setSearchLocation(value);
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SubscriptionPrompt
        onSubscribe={() => fetchSubscriptionStatus(false)}
        subscriptionStatus={subscriptionStatus}
        daysRemaining={daysRemaining}
        isLoading={subscriptionLoading}
      />

      {activeTab === "browse" && (
        <div>
          <SearchAndFilter
            searchLocation={searchLocation}
            onSearchChange={handleSearchChange}
            isSubscribed={hasActiveAccess}
            subscriptionStatus={subscriptionStatus}
            daysRemaining={daysRemaining}
            onFilter={() => console.log("Filter clicked")}
            currentLocation={userLocation} // ✅ uses detected location
          />

          <PropertyListContainer
            userLocation={searchLocation || userLocation} // ✅ priority: search > detected
            isSubscribed={hasActiveAccess}
            subscriptionStatus={subscriptionStatus}
            daysRemaining={daysRemaining}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default NyumbaTenantDashboard;

