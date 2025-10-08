// 'use client'

// import React, { useState, useEffect } from 'react'
// import LoginLinks from '@/app/LoginLinks'
// import { Home, Menu, X, Search, Heart, Bell, MapPin, Filter, Wifi, WifiOff } from 'lucide-react'

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [showQuickSearch, setShowQuickSearch] = useState(false)
//   const [locationData, setLocationData] = useState({
//     city: 'Blantyre',
//     country: 'Malawi',
//     activeListings: '2,847',
//     isRealTime: false,
//     lastUpdated: null
//   })
//   const [isOnline, setIsOnline] = useState(true)
//   const [locationError, setLocationError] = useState(null)

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

//   // Load cached location data on component mount
//   useEffect(() => {
//     const cachedLocation = localStorage.getItem('nyumba_location_data')
//     if (cachedLocation) {
//       try {
//         const parsed = JSON.parse(cachedLocation)
//         setLocationData(prev => ({ ...prev, ...parsed }))
//       } catch (error) {
//         console.warn('Failed to parse cached location data:', error)
//       }
//     }
//   }, [])

//   // Fetch real-time location when online
//   useEffect(() => {
//     if (!isOnline) return

//     const fetchLocation = async () => {
//       try {
//         setLocationError(null)

//         // Try IP-based geolocation first (faster and doesn't require permission)
//         const ipResponse = await fetch('https://ipapi.co/json/', {
//           timeout: 10000
//         })

//         if (ipResponse.ok) {
//           const ipData = await ipResponse.json()

//           if (ipData.city && ipData.country_name) {
//             const newLocationData = {
//               city: ipData.city,
//               country: ipData.country_name,
//               region: ipData.region,
//               activeListings: await fetchActiveListings(ipData.city, ipData.country_name),
//               isRealTime: true,
//               lastUpdated: new Date().toISOString(),
//               coordinates: {
//                 lat: ipData.latitude,
//                 lng: ipData.longitude
//               }
//             }

//             setLocationData(prev => ({ ...prev, ...newLocationData }))

//             // Cache the location data
//             localStorage.setItem('nyumba_location_data', JSON.stringify(newLocationData))
//             return
//           }
//         }

//         // Fallback to browser geolocation if IP geolocation fails
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             async (position) => {
//               const { latitude, longitude } = position.coords

//               try {
//                 // Reverse geocoding
//                 const geoResponse = await fetch(
//                   `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
//                 )

//                 if (geoResponse.ok) {
//                   const geoData = await geoResponse.json()

//                   const newLocationData = {
//                     city: geoData.city || geoData.locality || 'Unknown City',
//                     country: geoData.countryName || 'Unknown Country',
//                     region: geoData.principalSubdivision || '',
//                     activeListings: await fetchActiveListings(geoData.city, geoData.countryName),
//                     isRealTime: true,
//                     lastUpdated: new Date().toISOString(),
//                     coordinates: { lat: latitude, lng: longitude }
//                   }

//                   setLocationData(prev => ({ ...prev, ...newLocationData }))
//                   localStorage.setItem('nyumba_location_data', JSON.stringify(newLocationData))
//                 }
//               } catch (error) {
//                 console.warn('Reverse geocoding failed:', error)
//                 setLocationError('Location found but city name unavailable')
//               }
//             },
//             (error) => {
//               console.warn('Geolocation failed:', error)
//               setLocationError('Location access denied')
//             },
//             {
//               timeout: 15000,
//               maximumAge: 300000, // 5 minutes
//               enableHighAccuracy: false
//             }
//           )
//         }
//       } catch (error) {
//         console.warn('Location fetch failed:', error)
//         setLocationError('Unable to fetch location')
//       }
//     }

//     // Fetch location immediately and then every 30 minutes
//     fetchLocation()
//     const interval = setInterval(fetchLocation, 30 * 60 * 1000) // 30 minutes

//     return () => clearInterval(interval)
//   }, [isOnline])

//   // Mock function to fetch active listings (replace with your actual API)
//   const fetchActiveListings = async (city, country) => {
//     try {
//       // This is a mock implementation - replace with your actual API call
//       const mockListings = Math.floor(Math.random() * 5000) + 1000
//       return mockListings.toLocaleString()
//     } catch (error) {
//       return '2,847' // fallback
//     }
//   }

//   // Format last updated time
//   const getLastUpdatedText = () => {
//     if (!locationData.lastUpdated) return ''

//     const now = new Date()
//     const updated = new Date(locationData.lastUpdated)
//     const diffInMinutes = Math.floor((now - updated) / (1000 * 60))

//     if (diffInMinutes < 1) return 'Just now'
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
//     return `${Math.floor(diffInMinutes / 1440)}d ago`
//   }

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
//           <div className="flex items-center space-x-3 group cursor-pointer">
//   <div className="relative">
//     <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
//       <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
//     </div>
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300"></div>
//   </div>
//   <div className="flex flex-col">
//     <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-cyan-600 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
//       Nyumba App
//     </h2>
//     <span className="text-xs text-gray-500 font-medium hidden md:block">Find Your Dream Home</span>
//   </div>
// </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-6">
//               {/* Location Info with Status */}
//               <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-gray-200/30 group">
//                 <div className="flex items-center space-x-1">
//                   <MapPin className={`w-4 h-4 ${locationData.isRealTime ? 'text-green-600' : 'text-gray-500'}`} />
//                   {isOnline ? (
//                     <Wifi className="w-3 h-3 text-green-500" />
//                   ) : (
//                     <WifiOff className="w-3 h-3 text-gray-400" />
//                   )}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-semibold text-gray-800">{locationData.city}</span>
//                   {/* <span className="text-gray-500 ml-1">• {locationData.activeListings} homes</span> */}
//                 </div>

//                 {/* Tooltip with status */}
//                 <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg shadow-lg p-3 text-xs whitespace-nowrap border border-gray-200 z-10">
//                   <div className="font-semibold text-gray-800 mb-1">
//                     {locationData.isRealTime ? 'Real-time Location' : 'Cached Location'}
//                   </div>
//                   <div className="text-gray-600">
//                     {isOnline ? '🟢 Online' : '🔴 Offline'}
//                     {locationData.lastUpdated && (
//                       <div>Updated: {getLastUpdatedText()}</div>
//                     )}
//                   </div>
//                   {locationError && (
//                     <div className="text-red-500 mt-1">{locationError}</div>
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
//                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
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
//               {/* Location Header with Status */}
//               <div className="text-center mb-6">
//                 <div className="flex items-center justify-center space-x-2 mb-2">
//                   <MapPin className={`w-5 h-5 ${locationData.isRealTime ? 'text-green-600' : 'text-gray-500'}`} />
//                   {isOnline ? (
//                     <Wifi className="w-4 h-4 text-green-500" />
//                   ) : (
//                     <WifiOff className="w-4 h-4 text-gray-400" />
//                   )}
//                   <span className="font-semibold text-gray-800">{locationData.city}, {locationData.country}</span>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   {locationData.activeListings} available homes
//                 </p>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {locationData.isRealTime ? '📍 Real-time' : '💾 Cached'} •
//                   {isOnline ? ' Online' : ' Offline'}
//                   {locationData.lastUpdated && ` • ${getLastUpdatedText()}`}
//                 </div>
//                 {locationError && (
//                   <div className="text-xs text-red-500 mt-1">{locationError}</div>
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
//             <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
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


//show real location
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X, Search, Globe, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function Header() {
//   const pathname = usePathname();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [locationData, setLocationData] = useState({
//     city: null,
//     region: null,
//     country: null,
//     latitude: null,
//     longitude: null,
//     error: null,
//   });

//   // Fetch geolocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           try {
//             const { latitude, longitude } = pos.coords;
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
//             );
//             const data = await res.json();

//             setLocationData({
//               city: data.address.city || data.address.town || data.address.village || "Unknown",
//               region: data.address.state || null,
//               country: data.address.country || null,
//               latitude,
//               longitude,
//               error: null,
//             });
//           } catch (err) {
//             setLocationData((prev) => ({ ...prev, error: "Failed to fetch location" }));
//           }
//         },
//         (err) => {
//           setLocationData((prev) => ({ ...prev, error: "Permission denied" }));
//         }
//       );
//     } else {
//       setLocationData((prev) => ({ ...prev, error: "Geolocation not supported" }));
//     }
//   }, []);

//   const navigation = [
//     { name: "Home", href: "/" },
//     { name: "Listings", href: "/listings" },
//     { name: "About", href: "/about" },
//     { name: "Contact", href: "/contact" },
//   ];

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
//         <div className="flex w-full items-center justify-between border-b border-gray-200 py-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="text-xl font-bold text-primary">
//               Nyumba
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden ml-10 space-x-8 lg:flex">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`text-sm font-medium ${
//                   pathname === item.href ? "text-primary" : "text-gray-700 hover:text-primary"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>

//           {/* Location Info with Status */}
//           <div className="hidden lg:flex lg:items-center lg:space-x-4">
//             <div className="flex items-center space-x-2 text-gray-600">
//               <MapPin className="h-5 w-5 text-primary" />
//               <div className="text-sm">
//                 <span className="font-semibold text-gray-800">
//                   {locationData.city || "Detecting..."}
//                 </span>
//                 {locationData.country && (
//                   <span className="text-gray-600 ml-1">
//                     {locationData.region ? `${locationData.region}, ` : ""}
//                     {locationData.country}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Actions */}
//           <div className="ml-4 flex items-center lg:ml-6">
//             <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
//               <Search className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Globe className="h-5 w-5" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => setMobileMenuOpen(true)}
//             >
//               <Menu className="h-6 w-6" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 bg-white p-6 overflow-y-auto shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <Link href="/" className="text-xl font-bold text-primary">
//               Nyumba
//             </Link>
//             <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
//               <X className="h-6 w-6" />
//             </Button>
//           </div>

//           {/* Location Info */}
//           <div className="flex items-center space-x-2 mb-6 text-gray-600">
//             <MapPin className="h-5 w-5 text-primary" />
//             <div className="text-sm">
//               <span className="font-semibold text-gray-800">
//                 {locationData.city || "Detecting..."}
//                 {locationData.country &&
//                   `, ${locationData.region ? locationData.region + ", " : ""}${locationData.country}`}
//               </span>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`block text-base font-medium ${
//                   pathname === item.href ? "text-primary" : "text-gray-700 hover:text-primary"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



'use client'

import React, { useState, useEffect } from 'react'
import LoginLinks from '@/app/LoginLinks'
import { Home, Menu, X, Search, Heart, Bell, MapPin, Filter, Wifi, WifiOff } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQuickSearch, setShowQuickSearch] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // Simple location data state (from first component)
  const [locationData, setLocationData] = useState({
    city: null,
    region: null,
    country: null,
    latitude: null,
    longitude: null,
    error: null,
  })

  const quickActions = [
    { icon: Search, label: 'Find Homes', href: '/search', color: 'text-blue-600' },
    { icon: Heart, label: 'Saved Homes', href: '/favorites', color: 'text-red-500' },
    { icon: Filter, label: 'Filter', href: '/filter', color: 'text-green-600' },
  ]

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

  // Simple geolocation logic from first component
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
          } catch (err) {
            setLocationData((prev) => ({ ...prev, error: "Failed to fetch location" }));
          }
        },
        (err) => {
          setLocationData((prev) => ({ ...prev, error: "Permission denied" }));
        }
      );
    } else {
      setLocationData((prev) => ({ ...prev, error: "Geolocation not supported" }));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300"></div>
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
              {/* Simple Location Info with Status */}
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

                {/* Simple tooltip with status */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg shadow-lg p-3 text-xs whitespace-nowrap border border-gray-200 z-10">
                  <div className="font-semibold text-gray-800 mb-1">
                    Current Location
                  </div>
                  <div className="text-gray-600">
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                  </div>
                  {locationData.error && (
                    <div className="text-red-500 mt-1">{locationData.error}</div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.label}
                      className="group relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300"
                      title={action.label}
                    >
                      <Icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform duration-300`} />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
                        {action.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Notifications */}
              <button className="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 shadow-md border border-gray-200/30 hover:shadow-lg transition-all duration-300 group">
                <Bell className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </span>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-lg">
                  3 New Updates
                </span>
              </button>

              {/* Login Links */}
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
              {/* Simple Location Header with Status */}
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
                  const Icon = action.icon
                  return (
                    <button
                      key={action.label}
                      className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/80 hover:bg-white transition-all duration-300 group"
                    >
                      <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform duration-300`} />
                      <span className="text-xs font-medium text-gray-700">{action.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Notifications Panel */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Recent Updates</h4>
                    <p className="text-xs text-gray-600">3 new properties match your criteria</p>
                  </div>
                </div>
              </div>

              {/* Login Section */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome to Nyumba App</h3>
                <LoginLinks />
              </div>
            </div>

            {/* Decorative gradient bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
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
    </>
  )
}

export default Header
