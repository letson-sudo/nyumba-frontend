'use client'
import React, { useState, useEffect } from "react"
import {
  ArrowRight,
  Shield,
  MessageCircle,
  Lock,
  Stethoscope,
  Code,
  Briefcase,
  GraduationCap,
  Star,
  MapPin,
  Clock,
  Users,
  Loader2,
  Wifi,
  WifiOff,
  AlertCircle,
  Database,
  RefreshCw
} from "lucide-react"
import Footer from '../../Footer'

const LandingPage = () => {
  // Enhanced location data state with property fetching capabilities
  const [locationData, setLocationData] = useState({
    city: null,
    region: null,
    country: null,
    latitude: null,
    longitude: null,
    error: null,
    activeListings: '2,847',
    isLoading: true,
    isRealTime: false,
    lastUpdated: null
  })

  const [propertyStats, setPropertyStats] = useState({
    availableLocations: [],
    localPropertyCount: 0,
    isLoading: true,
    error: null,
    lastFetched: null,
    locationStrategy: 'basic', // 'basic' or 'advanced'
    fallbackStrategy: 'random', // 'random', 'popular', 'newest'
    locationMetadata: null
  })

  const [isOnline, setIsOnline] = useState(true)
  const [userStats, setUserStats] = useState({
    totalUsers: '15,000+',
    isLoading: true,
    error: null,
    lastFetched: null
  })

  // Get Laravel API base URL from environment or use default
  const LARAVEL_API_BASE = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000'

  // Location cleaning function from the first document
  const cleanLocationForBackend = (locationString) => {
    if (!locationString || typeof locationString !== 'string') return '';

    // Remove extra whitespace
    const trimmed = locationString.trim();

    // If location contains comma, take only the first part (city)
    // Examples: "Mzuzu, Malawi" -> "Mzuzu", "New York, NY, USA" -> "New York"
    const cityOnly = trimmed.split(',')[0].trim();

    // Log the cleaning process
    if (trimmed !== cityOnly) {
      console.log('Location cleaned for backend:', {
        original: trimmed,
        cleaned: cityOnly,
        removed: trimmed.replace(cityOnly, '').trim()
      });
    }

    return cityOnly;
  };

  // Location-based property fetching with exact API endpoints from first document
  const fetchPropertiesByLocation = async (location, strategy = 'basic') => {
    // Clean the location to get only city name
    const cleanedLocation = cleanLocationForBackend(location);

    if (!cleanedLocation) {
      throw new Error('INVALID_LOCATION');
    }

    const timestamp = new Date().getTime();

    let apiUrl;
    if (strategy === 'advanced') {
      // Use advanced endpoint with fallback strategy
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location-advanced?location=${encodeURIComponent(cleanedLocation)}&fallback=${propertyStats.fallbackStrategy}&limit=20&t=${timestamp}`;
    } else {
      // Use basic endpoint with simple fallback
      apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/location?location=${encodeURIComponent(cleanedLocation)}&limit=20&t=${timestamp}`;
    }

    console.log('Location-based API Request:', {
      originalLocation: location,
      cleanedLocation,
      strategy,
      fallbackStrategy: propertyStats.fallbackStrategy,
      apiUrl,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();

    // Log response metadata
    if (data.meta) {
      console.log('Location Response Metadata:', {
        requestedLocation: data.meta.requested_location,
        strategyUsed: data.meta.strategy_used,
        locationMatch: data.meta.location_match,
        totalReturned: data.meta.total_returned,
        message: data.meta.message
      });

      setPropertyStats(prev => ({
        ...prev,
        locationMetadata: data.meta
      }));
    }

    // Return properties array (handle both formats)
    return data.properties || data || [];
  };

  // Fallback to get all properties
  const fetchAllProperties = async () => {
    const timestamp = new Date().getTime();
    const apiUrl = `${LARAVEL_API_BASE}/api/tenant/properties/all?t=${timestamp}`;

    console.log('Fallback to All Properties:', {
      apiUrl,
      timestamp: new Date().toISOString()
    });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    return await response.json();
  };

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Enhanced geolocation with property fetching
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            const cityName = data.address.city || data.address.town || data.address.village || "Unknown";
            const regionName = data.address.state || null;
            const countryName = data.address.country || null;

            setLocationData({
              city: cityName,
              region: regionName,
              country: countryName,
              latitude,
              longitude,
              error: null,
              activeListings: '0', // Will be updated by property fetching
              isLoading: false,
              isRealTime: true,
              lastUpdated: new Date().toISOString()
            });

            // Trigger property fetching for this location
            if (cityName && cityName !== "Unknown") {
              fetchLocationProperties(cityName);
            }

          } catch (err) {
            setLocationData((prev) => ({
              ...prev,
              error: "Failed to fetch location",
              isLoading: false,
              city: 'your city',
              country: 'your country'
            }));
          }
        },
        (err) => {
          setLocationData((prev) => ({
            ...prev,
            error: "Permission denied",
            isLoading: false,
            city: 'your city',
            country: 'your country'
          }));
        }
      );
    } else {
      setLocationData((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        isLoading: false,
        city: 'your city',
        country: 'your country'
      }));
    }
  }, []);

  // Enhanced property fetching function using the exact logic from first document
  const fetchLocationProperties = async (city) => {
    if (!city || city === 'your city' || city === 'Unknown') return;

    try {
      setPropertyStats(prev => ({ ...prev, isLoading: true, error: null }));

      let propertiesData = [];

      console.log('Starting location-based property search for landing page:', {
        originalCity: city,
        cleanedCity: cleanLocationForBackend(city),
        strategy: propertyStats.locationStrategy,
        fallbackStrategy: propertyStats.fallbackStrategy,
        timestamp: new Date().toISOString()
      });

      try {
        // First attempt: location-based search
        propertiesData = await fetchPropertiesByLocation(city, propertyStats.locationStrategy);
      } catch (locationError) {
        console.warn('Location-based search failed, falling back to all properties:', {
          error: locationError.message,
          originalCity: city,
          cleanedCity: cleanLocationForBackend(city),
          strategy: propertyStats.locationStrategy
        });

        // Fallback: get all properties and count them
        try {
          propertiesData = await fetchAllProperties();
        } catch (fallbackError) {
          console.error('Both location and fallback searches failed:', fallbackError);
          throw fallbackError;
        }
      }

      // Validate properties data structure
      if (!Array.isArray(propertiesData)) {
        console.error('Invalid data format received:', typeof propertiesData);
        throw new Error('INVALID_DATA_FORMAT');
      }

      const propertyCount = propertiesData.length;

      console.log('Properties Data Received for landing page:', {
        totalProperties: propertyCount,
        city: city,
        cleanedCity: cleanLocationForBackend(city),
        locationMetadata: propertyStats.locationMetadata,
        strategy: propertyStats.locationStrategy
      });

      // Update location data with actual property count
      setLocationData(prev => ({
        ...prev,
        activeListings: propertyCount.toLocaleString()
      }));

      // Update property stats
      setPropertyStats(prev => ({
        ...prev,
        localPropertyCount: propertyCount,
        isLoading: false,
        error: null,
        lastFetched: new Date().toISOString()
      }));

    } catch (err) {
      console.error('Error in fetchLocationProperties:', {
        error: err.message,
        city,
        strategy: propertyStats.locationStrategy
      });

      setPropertyStats(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to fetch property data'
      }));

      // Set fallback count to 0 instead of keeping old data
      setLocationData(prev => ({
        ...prev,
        activeListings: '0'
      }));
    }
  };

  // Fetch user stats (unchanged from original)
  useEffect(() => {
    const fetchUserStats = async () => {
      // Load cached data first
      const cachedUserStats = localStorage.getItem('nyumba_user_stats')
      if (cachedUserStats) {
        try {
          const parsed = JSON.parse(cachedUserStats)
          // Use cached data if it's less than 5 minutes old
          const cacheAge = Date.now() - new Date(parsed.lastFetched).getTime()
          if (cacheAge < 300000) { // 5 minutes
            setUserStats(prev => ({
              ...prev,
              ...parsed,
              isLoading: false
            }))
            return
          }
        } catch (error) {
          console.warn('Failed to parse cached user stats:', error)
        }
      }

      if (!isOnline) {
        setUserStats(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        setUserStats(prev => ({ ...prev, error: null }))

        // Replace with your actual API base URL
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && typeof data.count === 'number') {
          const newUserStats = {
            totalUsers: data.count.toLocaleString(),
            rawCount: data.count,
            isLoading: false,
            error: null,
            lastFetched: new Date().toISOString()
          }

          setUserStats(newUserStats)

          // Cache the user stats
          localStorage.setItem('nyumba_user_stats', JSON.stringify(newUserStats))
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
        setUserStats(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to fetch user data'
        }))
      }
    }

    fetchUserStats()
  }, [isOnline])

  // Retry function for property fetching
  const handlePropertyRetry = () => {
    if (locationData.city && locationData.city !== 'your city') {
      fetchLocationProperties(locationData.city);
    }
  };

  // Toggle location strategy (for testing/debugging)
  const toggleLocationStrategy = () => {
    const newStrategy = propertyStats.locationStrategy === 'basic' ? 'advanced' : 'basic';
    console.log('Switching location strategy:', { from: propertyStats.locationStrategy, to: newStrategy });

    setPropertyStats(prev => ({
      ...prev,
      locationStrategy: newStrategy
    }));

    // Re-fetch with new strategy
    if (locationData.city && locationData.city !== 'your city') {
      fetchLocationProperties(locationData.city);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      desc: `All ${locationData.activeListings}+ houses in ${locationData.city || 'your city'} are verified for security and accuracy.`,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageCircle,
      title: "Direct Chat",
      desc: "Talk to landlords directly within the app, no middlemen fees.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Lock,
      title: "Privacy Guaranteed",
      desc: "No more awkward gate knocking—your house hunting stays private.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    }
  ]

  const professions = [
    { icon: Stethoscope, name: "Healthcare Workers", count: "450+", color: "text-red-500" },
    { icon: Code, name: "Tech Professionals", count: "320+", color: "text-blue-600" },
    { icon: Briefcase, name: "Business Executives", count: "680+", color: "text-gray-700" },
    { icon: GraduationCap, name: "Educators", count: "290+", color: "text-green-600" }
  ]

  const stats = [
    {
      icon: Users,
      label: "Active Users",
      value: userStats.totalUsers,
      isLoading: userStats.isLoading,
      error: userStats.error
    },
    {
      icon: MapPin,
      label: "Properties Listed",
      value: locationData.activeListings,
      isLoading: locationData.isLoading || propertyStats.isLoading,
      error: propertyStats.error
    },
    { icon: Clock, label: "Avg. Response Time", value: "2 hours" },
    { icon: Star, label: "User Rating", value: "4.8/5" }
  ]

  // Enhanced property status indicator
  const PropertyStatsStatus = () => {
    if (propertyStats.error) {
      return (
        <div className="inline-flex items-center space-x-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>Backend error</span>
          <button
            onClick={handlePropertyRetry}
            className="ml-1 px-1 py-0.5 bg-red-100 rounded text-xs hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )
    }

    if (propertyStats.isLoading) {
      return (
        <div className="inline-flex items-center space-x-1 text-xs text-blue-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Fetching from backend...</span>
        </div>
      )
    }

    if (propertyStats.lastFetched && propertyStats.locationMetadata) {
      const isRecent = Date.now() - new Date(propertyStats.lastFetched).getTime() < 60000 // 1 minute
      return (
        <div className={`inline-flex items-center space-x-1 text-xs ${isRecent ? 'text-green-600' : 'text-orange-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-400' : 'bg-orange-400'} ${isRecent ? 'animate-pulse' : ''}`}></div>
          <span>{isRecent ? 'Live from Laravel' : 'Cached data'}</span>
          <span className="text-gray-500">• {propertyStats.locationMetadata.strategy_used} strategy</span>
          {/* Debug button */}
          <button
            onClick={toggleLocationStrategy}
            className="ml-1 px-1 py-0.5 bg-gray-100 rounded text-xs hover:bg-gray-200"
            title="Toggle search strategy"
          >
            Switch
          </button>
        </div>
      )
    }

    return null
  }

  // User status indicator (unchanged)
  const UserStatsStatus = () => {
    if (userStats.error) {
      return (
        <div className="inline-flex items-center space-x-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>Using cached data</span>
        </div>
      )
    }

    if (userStats.lastFetched) {
      const isRecent = Date.now() - new Date(userStats.lastFetched).getTime() < 300000 // 5 minutes
      return (
        <div className={`inline-flex items-center space-x-1 text-xs ${isRecent ? 'text-green-600' : 'text-orange-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-400' : 'bg-orange-400'} ${isRecent ? 'animate-pulse' : ''}`}></div>
          <span>{isRecent ? 'Live data' : 'Cached data'}</span>
        </div>
      )
    }

    return null
  }

  return (
    <>
    <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 scroll-py-16 mt-16 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-blue-800 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              {locationData.isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Detecting your location...
                </>
              ) : (
                <>
                  Now Available in {locationData.city || 'your city'}, {locationData.country || 'your country'}
                  {locationData.error && (
                    <span className="ml-2 text-orange-600 text-xs">({locationData.error})</span>
                  )}
                </>
              )}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Your Perfect Home, Just a Tap Away{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent">
              Nyumba App
            </span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Skip the knocks, skip the shocks—discover trusted <span className="font-semibold text-blue-600">{locationData.city || 'your city'}</span> rentals  with grace, space, and privacy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Enhanced Location Status */}
          {locationData.city && locationData.city !== 'your city' && propertyStats.locationMetadata && (
            <div className={`max-w-md mx-auto mb-8 border rounded-lg p-3 text-sm ${
              propertyStats.locationMetadata.location_match
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center justify-center">
                <Database className="w-4 h-4 mr-2" />
                <span>{propertyStats.locationMetadata.message}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Strategy: {propertyStats.locationMetadata.strategy_used} •
                 {cleanLocationForBackend(locationData.city)}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : stat.error ? (
                      <span className="text-red-500 text-base">Error</span>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>

                  {/* Show status for Active Users stat */}
                  {stat.label === "Active Users" && (
                    <div className="mt-1">
                      <UserStatsStatus />
                    </div>
                  )}

                  {/* Show enhanced status for Properties Listed stat */}
                  {stat.label === "Properties Listed" && (
                    <div className="mt-1">
                      <PropertyStatsStatus />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )
          })}
        </div>

        {/* Professionals Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Professionals Across {locationData.city || 'your city'}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join {userStats.isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  thousands of
                </span>
              ) : userStats.error ? (
                "thousands of"
              ) : (
                userStats.totalUsers
              )} working professionals who've found their perfect home through Nyumba App
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {professions.map((prof, i) => {
              const Icon = prof.icon
              return (
                <div key={i} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-4 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                    <Icon className={`w-8 h-8 ${prof.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{prof.name}</h4>
                  <p className="text-sm text-gray-600">{prof.count} members</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Join {userStats.isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  thousands of
                </span>
              ) : userStats.error ? (
                "thousands of"
              ) : (
                userStats.totalUsers + "+"
              )} professionals in {locationData.city || 'your city'} who trust Nyumba App for their housing needs
            </p>
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center">
              Start Your Search Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>

            {/* Enhanced location info in CTA */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-green-100 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {locationData.activeListings} properties available in {locationData.city || 'your city'}
                {locationData.region && `, ${locationData.region}`}
              </span>
              {locationData.isRealTime && propertyStats.locationMetadata && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live data from Laravel backend"></div>
              )}
            </div>

            {/* API Status in CTA */}
            {propertyStats.locationMetadata && (
              <div className="mt-2 text-green-200 text-xs">
                 {propertyStats.locationMetadata.strategy_used} search •
                {propertyStats.locationMetadata.location_match ? ' Exact match' : ' Fallback results'}
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}

export default LandingPage
