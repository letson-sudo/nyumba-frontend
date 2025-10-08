// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'

// export default function TotalListings() {
//   const [count, setCount] = useState(0)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchTotalListings = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const res = await axios.get('http://localhost:8000/api/properties', {
//           withCredentials: true // Required for Sanctum auth
//         })

//         console.log('API Response:', res.data) // Debug log

//         // Your controller returns: { latest: {...}, count: 5 }
//         if (res.data && typeof res.data.count !== 'undefined') {
//           setCount(res.data.count)
//         } else {
//           console.warn('Unexpected response format:', res.data)
//           setCount(0)
//         }

//       } catch (error) {
//         console.error('Failed to fetch total listings:', error)
//         setError(error.message)
//         setCount(0)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchTotalListings()
//   }, [])

//   return (
//     <div className="bg-white shadow-lg rounded-2xl p-6 text-center text-orange-500 hover:shadow-xl">
//       <h3 className="text-sm font-medium  tracking-wide">Total Listings</h3>

//       {isLoading ? (
//         <div className="text-3xl font-extrabold mt-3 orange-500">
//           <div className="animate-pulse">...</div>
//         </div>
//       ) : error ? (
//         <div className="text-3xl font-extrabold mt-3 text-red-200">
//           --
//         </div>
//       ) : (
//         <p className="text-3xl font-extrabold mt-3 text-orange-500">{count}</p>
//       )}

//       {error && (
//         <p className="text-xs text-white/75 mt-1">Failed to load</p>
//       )}
//     </div>
//   )
// }



'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Building2, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'

export default function TotalListings() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTotalListings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await axios.get('http://localhost:8000/api/properties', {
          withCredentials: true // Required for Sanctum auth
        })
        console.log('API Response:', res.data) // Debug log

        // Your controller returns: { latest: {...}, count: 5 }
        if (res.data && typeof res.data.count !== 'undefined') {
          setCount(res.data.count)
        } else {
          console.warn('Unexpected response format:', res.data)
          setCount(0)
        }
      } catch (error) {
        console.error('Failed to fetch total listings:', error)
        setError(error.message)
        setCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTotalListings()
  }, [])

  return (
    <div className="group relative bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200/50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50"></div>

      {/* Floating Icon Background */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all duration-300"></div>

      {/* Header with Icon */}
      <div className="relative flex items-center justify-center gap-3 mb-4">
        <div className="bg-orange-500 p-3 rounded-full shadow-lg group-hover:bg-orange-600 transition-colors duration-300">
          <Building2 className="text-white" size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300 tracking-wide">
            Total Listings
          </h3>
          <div className="flex items-center gap-1 text-xs text-orange-500">
            <TrendingUp size={12} />
            <span>All Properties</span>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-orange-500 mt-3 mb-2">
            <Loader2 className="animate-spin" size={28} />
            <span className="animate-pulse">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-3xl font-extrabold text-red-400 mb-2">--</p>
            <div className="flex items-center justify-center gap-1 text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full">
              <AlertTriangle size={12} />
              <span>Failed to load</span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:to-amber-700 transition-all duration-300 mb-2">
              {count.toLocaleString()}
            </p>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-500 font-medium">
                {count > 0 ? `${count} Active Listing${count !== 1 ? 's' : ''}` : 'No Listings'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Activity Indicator */}
      {!isLoading && !error && count > 0 && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            {/* <Building2 size={12} /> */}
            {/* <span className="font-medium">Portfolio Active</span> */}
          </div>
        </div>
      )}

      {/* Progress Visualization */}
      {!isLoading && !error && count > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full w-full relative">
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-orange-300 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-orange-200 rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-orange-100 rounded-sm"></div>
        </div>
      </div>

      {/* Error State Retry Hint */}
      {error && (
        <div className="mt-2 text-xs text-gray-400 opacity-75">
          Refresh to retry
        </div>
      )}

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  )
}
