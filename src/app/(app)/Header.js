// 'use client'

// import React, { useState, useEffect } from 'react'
// import LoginLinks from '@/app/LoginLinks'
// import { Home, Menu, X, Search, Heart, Bell, MapPin, Filter, Wifi, WifiOff } from 'lucide-react'

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [isOnline, setIsOnline] = useState(true)

//   // Simple location data state (from first component)
//   const [locationData, setLocationData] = useState({
//     city: null,
//     region: null,
//     country: null,
//     latitude: null,
//     longitude: null,
//     error: null,
//   })

//   const quickActions = [
//     { icon: Search, label: 'Find Homes', href: '/search', color: 'text-blue-600' },
//     { icon: Heart, label: 'Saved Homes', href: '/favorites', color: 'text-red-500' },
//     { icon: Filter, label: 'Filter', href: '/filter', color: 'text-green-600' },
//   ]

//   // Check online status
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)

//     setIsOnline(navigator.onLine)
//     window.addEventListener('online', handleOnline)
//     window.addEventListener('offline', handleOffline)

//     return () => {
//       window.removeEventListener('online', handleOnline)
//       window.removeEventListener('offline', handleOffline)
//     }
//   }, [])

//   // Simple geolocation logic from first component
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           try {
//             const { latitude, longitude } = pos.coords
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
//             )
//             const data = await res.json()

//             setLocationData({
//               city: data.address.city || data.address.town || data.address.village || "Unknown",
//               region: data.address.state || null,
//               country: data.address.country || null,
//               latitude,
//               longitude,
//               error: null,
//             })
//           } catch {
//             setLocationData((prev) => ({ ...prev, error: "Failed to fetch location" }))
//           }
//         },
//         () => {
//           setLocationData((prev) => ({ ...prev, error: "Permission denied" }))
//         }
//       )
//     } else {
//       setLocationData((prev) => ({ ...prev, error: "Geolocation not supported" }))
//     }
//   }, [])

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-[6000] w-full transition-all duration-500 ${
//         isScrolled
//           ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/20'
//           : 'bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md shadow-sm'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="flex justify-between items-center py-2 md:py-4">
//             {/* Logo Section */}
//             <div className="flex items-center space-x-3 group cursor-pointer">
//               <div className="relative">
//                 <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
//                   <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                 </div>
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300" />
//               </div>
//               <div className="flex flex-col">
//                 <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-cyan-600 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
//                   Nyumba App
//                 </h2>
//                 <span className="text-xs text-gray-500 font-medium hidden md:block">Find Your Dream Home</span>
//               </div>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-6">
//               {/* Simple Location Info with Status */}
//               <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-gray-200/30 group">
//                 <div className="flex items-center space-x-1">
//                   <MapPin className="w-4 h-4 text-blue-600" />
//                   {isOnline ? (
//                     <Wifi className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <WifiOff className="w-3 h-3 text-gray-400" />
//                   )}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-semibold text-gray-800">
//                     {locationData.city || "Detecting..."}
//                   </span>
//                   {locationData.country && (
//                     <span className="text-gray-500 ml-1">
//                       {locationData.region ? `${locationData.region}, ` : ""}
//                       {locationData.country}
//                     </span>
//                   )}
//                 </div>

//                 {/* Simple tooltip with status */}
//                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg shadow-lg p-3 text-xs whitespace-nowrap border border-gray-200 z-10">
//                   <div className="font-semibold text-gray-800 mb-1">
//                     Current Location
//                   </div>
//                   <div className="text-gray-600">
//                     {isOnline ? '🟢 Online' : '🔴 Offline'}
//                   </div>
//                   {locationData.error && (
//                     <div className="text-red-500 mt-1">{locationData.error}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="flex items-center space-x-2">
//                 {quickActions.map((action) => {
//                   const Icon = action.icon
//                   return (
//                     <button
//                       key={action.label}
//                       className="group relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300"
//                       title={action.label}
//                     >
//                       <Icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform duration-300`} />
//                       <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
//                         {action.label}
//                       </span>
//                     </button>
//                   )
//                 })}
//               </div>

//               {/* Notifications */}
//               <button className="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300 group">
//                 <Bell className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
//                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                 </span>
//                 <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
//                   3 New Updates
//                 </span>
//               </button>

//               {/* Login Links */}
//               <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
//                 <LoginLinks />
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden relative p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
//             >
//               <div className="relative w-5 h-5">
//                 <Menu className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
//                 <X className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu Overlay */}
//         <div className={`md:hidden fixed inset-x-0 top-full transition-all duration-500 ${
//           isMobileMenuOpen
//             ? 'opacity-100 translate-y-0 pointer-events-auto'
//             : 'opacity-0 -translate-y-4 pointer-events-none'
//         }`}>
//           <div className="mx-4 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//             <div className="p-6">
//               {/* Simple Location Header with Status */}
//               <div className="text-center mb-6">
//                 <div className="flex items-center justify-center space-x-2 mb-2">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   {isOnline ? (
//                     <Wifi className="w-4 h-4 text-green-500" />
//                   ) : (
//                     <WifiOff className="w-4 h-4 text-gray-400" />
//                   )}
//                   <span className="font-semibold text-gray-800">
//                     {locationData.city || "Detecting..."}{locationData.country && `, ${locationData.country}`}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {isOnline ? 'Online' : 'Offline'}
//                 </div>
//                 {locationData.error && (
//                   <div className="text-xs text-red-500 mt-1">{locationData.error}</div>
//                 )}
//               </div>

//               {/* Quick Actions Grid */}
//               <div className="grid grid-cols-3 gap-3 mb-6">
//                 {quickActions.map((action) => {
//                   const Icon = action.icon
//                   return (
//                     <button
//                       key={action.label}
//                       className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/80 hover:bg-white transition-all duration-300 group"
//                     >
//                       <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform duration-300`} />
//                       <span className="text-xs font-medium text-gray-700">{action.label}</span>
//                     </button>
//                   )
//                 })}
//               </div>

//               {/* Notifications Panel */}
//               <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6">
//                 <div className="flex items-center space-x-3">
//                   <Bell className="w-5 h-5 text-orange-600" />
//                   <div>
//                     <h4 className="font-semibold text-gray-800 text-sm">Recent Updates</h4>
//                     <p className="text-xs text-gray-600">3 new properties match your criteria</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Login Section */}
//               <div className="text-center">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome to Nyumba App</h3>
//                 <LoginLinks />
//               </div>
//             </div>

//             {/* Decorative gradient bar */}
//             <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600" />
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu Backdrop */}
//       {isMobileMenuOpen && (
//         <div
//           className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[5999] transition-opacity duration-300"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </>
//   )
// }

// export default Header




"use client";
import React, { useState, useEffect } from 'react';
import LoginLinks from '@/app/LoginLinks';
import { Home, Menu, X, Search, Heart, Bell, MapPin, Filter, Wifi, WifiOff } from 'lucide-react';
import SearchModal from "@/components/tenant/header/SearchModal";
import FavoritesModal from '@/components/tenant/header/FavoritesModal';
import FilterModal from '@/components/tenant/header/FilterModal';
import NotificationsModal from '@/components/tenant/header/NotificationsModal'; // Fixed import

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Modal states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false); // Added this
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Location data state
  const [locationData, setLocationData] = useState({
    city: null,
    region: null,
    country: null,
    latitude: null,
    longitude: null,
    error: null,
  });

  const quickActions = [
    {
      icon: Search,
      label: 'Find Homes',
      onClick: () => setIsSearchModalOpen(true),
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Saved Homes',
      onClick: () => setIsFavoritesModalOpen(true),
      color: 'text-red-500'
    },
    {
      icon: Filter,
      label: 'Filter',
      onClick: () => setIsFilterModalOpen(true),
      color: 'text-green-600'
    },
  ];

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simple geolocation logic
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

            setLocationData({
              city: data.address.city || data.address.town || data.address.village || "Unknown",
              region: data.address.state || null,
              country: data.address.country || null,
              latitude,
              longitude,
              error: null,
            });
          } catch {
            setLocationData((prev) => ({ ...prev, error: "Failed to fetch location" }));
          }
        },
        () => {
          setLocationData((prev) => ({ ...prev, error: "Permission denied" }));
        }
      );
    } else {
      setLocationData((prev) => ({ ...prev, error: "Geolocation not supported" }));
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler functions
  const handleSearch = (searchQuery) => {
    console.log('Searching for:', searchQuery);
    // Integrate with your existing search functionality
  };

  const handleFilter = (filters) => {
    console.log('Applying filters:', filters);
    // Integrate with your property filtering
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[6000] w-full transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/20'
          : 'bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center py-2 md:py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-cyan-600 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  Nyumba App
                </h2>
                <span className="text-xs text-gray-500 font-medium hidden md:block">Find Your Dream Home</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Location Info */}
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-gray-200/30 group">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {isOnline ? (
                    <Wifi className="w-3 h-3 text-green-500" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-800">
                    {locationData.city || "Detecting..."}
                  </span>
                  {locationData.country && (
                    <span className="text-gray-500 ml-1">
                      {locationData.region ? `${locationData.region}, ` : ""}
                      {locationData.country}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="group relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300"
                      title={action.label}
                    >
                      <Icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform duration-300`} />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Notifications */}
              <button
                onClick={() => setIsNotificationsModalOpen(true)}
                className="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300 group"
              >
                <Bell className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
                  Notifications
                </span>
              </button>

              {/* Login Links - USED EXACTLY AS BEFORE */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-2 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                <LoginLinks />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-x-0 top-full transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="mx-4 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="p-6">
              {/* Location Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-800">
                    {locationData.city || "Detecting..."}{locationData.country && `, ${locationData.country}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {isOnline ? 'Online' : 'Offline'}
                </div>
                {locationData.error && (
                  <div className="text-xs text-red-500 mt-1">{locationData.error}</div>
                )}
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/80 hover:bg-white transition-all duration-300 group"
                    >
                      <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform duration-300`} />
                      <span className="text-xs font-medium text-gray-700">{action.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notifications Panel */}
              <div
                onClick={() => setIsNotificationsModalOpen(true)}
                className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6 cursor-pointer hover:from-orange-100 hover:to-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Recent Updates</h4>
                    <p className="text-xs text-gray-600">
                      {unreadNotificationsCount > 0
                        ? `${unreadNotificationsCount} new notifications`
                        : 'No new notifications'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Section - USED EXACTLY AS BEFORE */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome to Nyumba App</h3>
                <LoginLinks />
              </div>
            </div>

            {/* Decorative gradient bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600" />
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[5999] transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* All Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilter={handleFilter}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default Header;





