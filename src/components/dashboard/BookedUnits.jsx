// 'use client'

// import { useState, useEffect } from 'react'
// import { Home, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
// import axios from '@/lib/axios'

// export default function BookedUnits({ refreshTrigger = 0 }) {
//   const [count, setCount] = useState(0)
//   const [bookedProperties, setBookedProperties] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const fetchBookedUnits = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await axios.get('/api/status/booked', {
//         withCredentials: true,
//       })

//       console.log('📥 Booked units response:', response.data)

//       if (response.data?.success) {
//         const { count: bookedCount, properties } = response.data.data
//         setCount(bookedCount || 0)
//         setBookedProperties(properties || [])
//       } else {
//         setError('Failed to fetch booked units')
//         setCount(0)
//         setBookedProperties([])
//       }
//     } catch (err) {
//       console.error('❌ Failed to fetch booked units:', err)

//       if (err.response?.status === 401) {
//         setError('Please log in to view booked units')
//       } else if (err.response?.status === 403) {
//         setError('Access denied')
//       } else {
//         setError('Failed to load booked units')
//       }

//       setCount(0)
//       setBookedProperties([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Fetch data on component mount and when refreshTrigger changes
//   useEffect(() => {
//     fetchBookedUnits()
//   }, [refreshTrigger])

//   // Handle click to show booked properties details
//   const handleClick = () => {
//     if (count > 0) {
//       console.log('📋 Booked Properties:', bookedProperties)
//       // You can add modal or navigation logic here
//       // For example: setShowBookedModal(true)
//     }
//   }

//   return (
//     <div
//       className="group relative bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
//       onClick={handleClick}
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50"></div>

//       {/* Floating Icon Background */}
//       <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all duration-300"></div>

//       {/* Header with Icon */}
//       <div className="relative flex items-center justify-center gap-3 mb-4">
//         <div className="bg-red-500 p-3 rounded-full shadow-lg group-hover:bg-red-600 transition-colors duration-300">
//           {isLoading ? (
//             <Loader2 className="text-white animate-spin" size={20} />
//           ) : error ? (
//             <AlertCircle className="text-white" size={20} />
//           ) : (
//             <Home className="text-white" size={20} />
//           )}
//         </div>
//         <div className="text-left">
//           <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-300 tracking-wide">
//             Booked Units
//           </h3>
//           <div className="flex items-center gap-1 text-xs text-red-500">
//             <Calendar size={12} />
//             <span>
//               {isLoading ? 'Loading...' : error ? 'Error' : 'Currently Occupied'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Count Display */}
//       <div className="relative">
//         {isLoading ? (
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <Loader2 size={20} className="animate-spin text-red-500" />
//             <span className="text-sm text-gray-500">Loading booked units...</span>
//           </div>
//         ) : error ? (
//           <div className="mb-4">
//             <p className="text-2xl font-bold text-red-400 mb-2">--</p>
//             <p className="text-xs text-red-500">{error}</p>
//           </div>
//         ) : (
//           <>
//             <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-rose-700 transition-all duration-300 mb-2">
//               {count.toLocaleString()}
//             </p>

//             {/* Status Indicator */}
//             <div className="flex items-center justify-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-red-400 animate-pulse' : 'bg-gray-300'}`}></div>
//               <span className="text-xs text-gray-500 font-medium">
//                 {count > 0 ? `${count} Unit${count !== 1 ? 's' : ''} Booked` : 'No Bookings'}
//               </span>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Occupancy Visualization */}
//       {!isLoading && !error && count > 0 && (
//         <div className="mt-4 flex items-center justify-center gap-2">
//           <div className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
//             <CheckCircle2 size={12} />
//             <span className="font-medium">Active Bookings</span>
//           </div>
//         </div>
//       )}

//       {/* Booking Status Bar */}
//       {!isLoading && !error && count > 0 && (
//         <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full w-4/5 relative">
//             <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
//           </div>
//         </div>
//       )}

//       {/* Click to View Details Hint */}
//       {!isLoading && !error && count > 0 && (
//         <div className="mt-3 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           Click to view details
//         </div>
//       )}

//       {/* Retry Button for Errors */}
//       {error && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation()
//             fetchBookedUnits()
//           }}
//           className="mt-3 text-xs text-red-500 hover:text-red-600 underline transition-colors duration-200"
//         >
//           Retry
//         </button>
//       )}

//       {/* Decorative Elements */}
//       <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
//         <div className="flex gap-1">
//           <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
//           <div className="w-1.5 h-1.5 bg-red-300 rounded-full"></div>
//           <div className="w-1.5 h-1.5 bg-red-200 rounded-full"></div>
//         </div>
//       </div>

//       {/* Subtle Border Glow */}
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { Home, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

export default function BookedUnits({ refreshTrigger = 0 }) {
  const [bookedCount, setBookedCount] = useState(0)
  const [totalProperties, setTotalProperties] = useState(0)
  const [bookedProperties, setBookedProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch both booked units and total properties simultaneously
      const [bookedRes, propertiesRes] = await Promise.all([
        fetch('http://localhost:8000/api/status/booked', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => res.json()),
        fetch('http://localhost:8000/api/properties', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => res.json())
      ])

      console.log('📥 Booked units response:', bookedRes)
      console.log('📥 Properties response:', propertiesRes)

      // Handle booked units response
      let booked = 0
      let properties = []
      if (bookedRes?.success) {
        const { count: bookedUnitsCount, properties: bookedProps } = bookedRes.data
        booked = bookedUnitsCount || 0
        properties = bookedProps || []
      } else {
        console.warn('Unexpected booked units response format:', bookedRes)
      }

      // Handle total properties response
      let total = 0
      if (propertiesRes && typeof propertiesRes.count !== 'undefined') {
        total = propertiesRes.count
      } else {
        console.warn('Unexpected properties response format:', propertiesRes)
      }

      setBookedCount(booked)
      setTotalProperties(total)
      setBookedProperties(properties)

      console.log('📊 Calculated values:', { booked, total, occupancyRate: total > 0 ? (booked / total * 100).toFixed(1) : 0 })

    } catch (err) {
      console.error('❌ Failed to fetch data:', err)
      setError('Failed to load data')
      setBookedCount(0)
      setTotalProperties(0)
      setBookedProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  // Calculate occupancy percentage
  const getOccupancyPercentage = () => {
    if (totalProperties === 0) return 0
    return (bookedCount / totalProperties) * 100
  }

  // Get progress bar color based on occupancy rate
  const getProgressColor = () => {
    const percentage = getOccupancyPercentage()
    if (percentage >= 80) return 'from-red-600 to-rose-600'
    if (percentage >= 60) return 'from-orange-500 to-red-500'
    if (percentage >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-yellow-500'
  }

  // Handle click to show booked properties details
  const handleClick = () => {
    if (error) {
      fetchData()
    } else if (bookedCount > 0) {
      console.log('📋 Booked Properties Details:', {
        bookedCount,
        totalProperties,
        occupancyRate: getOccupancyPercentage().toFixed(1) + '%',
        properties: bookedProperties
      })
      // You can add modal or navigation logic here
      // For example: setShowBookedModal(true)
    }
  }

  return (
    <div
      className="group relative bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50"></div>

      {/* Floating Icon Background */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all duration-300"></div>

      {/* Header with Icon */}
      <div className="relative flex items-center justify-center gap-3 mb-4">
        <div className="bg-red-500 p-3 rounded-full shadow-lg group-hover:bg-red-600 transition-colors duration-300">
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={20} />
          ) : error ? (
            <AlertCircle className="text-white" size={20} />
          ) : (
            <Home className="text-white" size={20} />
          )}
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-300 tracking-wide">
            Booked Units
          </h3>
          <div className="flex items-center gap-1 text-xs text-red-500">
            <Calendar size={12} />
            <span>
              {isLoading ? 'Loading...' : error ? 'Error' : 'Currently Occupied'}
            </span>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 size={20} className="animate-spin text-red-500" />
            <span className="text-sm text-gray-500">Loading occupancy data...</span>
          </div>
        ) : error ? (
          <div className="mb-4">
            <p className="text-2xl font-bold text-red-400 mb-2">--</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-rose-700 transition-all duration-300 mb-2">
              {bookedCount.toLocaleString()}
            </p>

            {/* Status Indicator with breakdown */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${bookedCount > 0 ? 'bg-red-400 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500 font-medium">
                  {bookedCount > 0 ? `${bookedCount} Unit${bookedCount !== 1 ? 's' : ''} Booked` : 'No Bookings'}
                </span>
              </div>

              {/* Breakdown info */}
              {totalProperties > 0 && (
                <div className="text-xs text-gray-400">
                  {/* {bookedCount} of {totalProperties} units occupied */}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Occupancy Visualization */}
      {!isLoading && !error && bookedCount > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* <div className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
            <CheckCircle2 size={12} />
            <span className="font-medium">Active Bookings</span>
          </div> */}
        </div>
      )}

      {/* Real-time Occupancy Progress Bar */}
      {!isLoading && !error && totalProperties > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-1000 relative`}
            style={{ width: `${getOccupancyPercentage()}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {/* Occupancy Percentage Display */}
      {!isLoading && !error && totalProperties > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {/* {getOccupancyPercentage().toFixed(1)}% occupancy rate */}
        </div>
      )}

      {/* Click to View Details Hint */}
      {!isLoading && !error && bookedCount > 0 && (
        <div className="mt-3 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Click to view details */}
        </div>
      )}

      {/* Retry Button for Errors */}
      {error && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            fetchData()
          }}
          className="mt-3 text-xs text-red-500 hover:text-red-600 underline transition-colors duration-200"
        >
          Retry
        </button>
      )}

      {/* Dynamic Decorative Elements - Occupancy Indicators */}
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(6)].map((_, i) => {
            const threshold = (i + 1) / 6
            const occupancyRate = getOccupancyPercentage() / 100
            return (
              <div
                key={i}
                className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                  occupancyRate >= threshold
                    ? 'bg-red-400'
                    : 'bg-gray-300'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* High Occupancy Warning */}
      {!isLoading && !error && getOccupancyPercentage() >= 90 && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
      )}

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  )
}
