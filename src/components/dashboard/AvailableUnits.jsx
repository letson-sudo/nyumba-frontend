'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, CheckCircle, AlertTriangle, Loader2, Zap } from 'lucide-react'

export default function AvailableUnits({ refreshTrigger = 0 }) {
  const [totalProperties, setTotalProperties] = useState(0)
  const [bookedCount, setBookedCount] = useState(0)
  const [availableCount, setAvailableCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch total properties and booked units simultaneously
      const [propertiesRes, bookedRes] = await Promise.all([
        axios.get('http://localhost:8000/api/properties', {
          withCredentials: true
        }),
        axios.get('http://localhost:8000/api/status/booked', {
          withCredentials: true
        })
      ])

      console.log('Properties API Response:', propertiesRes.data)
      console.log('Booked Units API Response:', bookedRes.data)

      // Get total properties count
      let total = 0
      if (propertiesRes.data && typeof propertiesRes.data.count !== 'undefined') {
        total = propertiesRes.data.count
      } else {
        console.warn('Unexpected properties response format:', propertiesRes.data)
      }

      // Get booked units count
      let booked = 0
      if (bookedRes.data?.success && bookedRes.data.data?.count) {
        booked = bookedRes.data.data.count
      } else if (bookedRes.data?.success && bookedRes.data.data?.count === 0) {
        booked = 0 // Explicitly handle 0 booked units
      } else {
        console.warn('Unexpected booked units response format:', bookedRes.data)
      }

      // Calculate available units
      const available = Math.max(0, total - booked) // Ensure non-negative

      setTotalProperties(total)
      setBookedCount(booked)
      setAvailableCount(available)

      console.log('Calculated values:', { total, booked, available })

    } catch (error) {
      console.error('Failed to fetch data:', error)

      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError('Authentication required')
      } else if (error.response?.status === 403) {
        setError('Access denied')
      } else {
        setError('Failed to load data')
      }

      setTotalProperties(0)
      setBookedCount(0)
      setAvailableCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  // Calculate progress bar percentage based on availability ratio
  const getProgressPercentage = () => {
    if (totalProperties === 0) return 0
    return (availableCount / totalProperties) * 100
  }

  // Get progress bar color based on availability
  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 70) return 'from-green-500 to-emerald-500'
    if (percentage >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  // Handle click to refresh data or show details
  const handleClick = () => {
    if (error) {
      fetchData()
    } else {
      console.log('Available Units Details:', {
        total: totalProperties,
        booked: bookedCount,
        available: availableCount,
        percentage: getProgressPercentage()
      })
      // You can add modal or navigation logic here
    }
  }

  return (
    <div
      className="group relative bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200/50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden z-10"
      onClick={handleClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50"></div>

      {/* Floating Icon Background */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all duration-300"></div>

      {/* Header with Icon */}
      <div className="relative flex items-center justify-center gap-3 mb-4">
        <div className="bg-green-500 p-3 rounded-full shadow-lg group-hover:bg-green-600 transition-colors duration-300">
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={20} />
          ) : error ? (
            <AlertTriangle className="text-white" size={20} />
          ) : (
            <Home className="text-white" size={20} />
          )}
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-300 tracking-wide">
            Available Units
          </h3>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Zap size={12} />
            <span>
              {isLoading ? 'Loading...' : error ? 'Error' : 'Ready to Rent'}
            </span>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 size={20} className="animate-spin text-green-500" />
            <span className="text-sm text-gray-500">Calculating availability...</span>
          </div>
        ) : error ? (
          <div className="mb-4">
            <p className="text-2xl font-bold text-red-400 mb-2">--</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-300 mb-2">
              {availableCount.toLocaleString()}
            </p>

            {/* Status Indicator with breakdown */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${availableCount > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500 font-medium">
                  {availableCount > 0 ? `${availableCount} Unit${availableCount !== 1 ? 's' : ''} Available` : 'All Units Occupied'}
                </span>
              </div>

              {/* Breakdown info */}
              {/* <div className="text-xs text-gray-400">
                {bookedCount} booked of {totalProperties} total
              </div> */}
            </div>
          </>
        )}
      </div>

      {/* Availability Badge */}
      {!isLoading && !error && availableCount > 0 && (
        <div className="mt-4 flex items-center justify-center">
          {/* <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full">
            <CheckCircle size={12} />
            <span className="font-medium">Ready for Booking</span>
          </div> */}
        </div>
      )}

      {/* Dynamic Availability Meter */}
      {!isLoading && !error && totalProperties > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-1000 relative`}
            style={{ width: `${getProgressPercentage()}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
          </div>
        </div>
      )}

      {/* Percentage Display */}
      {!isLoading && !error && totalProperties > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {/* {getProgressPercentage().toFixed(1)}% available */}
        </div>
      )}

      {/* Decorative Elements - House Grid */}
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-sm ${
                i < Math.ceil((availableCount / totalProperties) * 6) ? 'bg-green-400' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Success State Animation */}
      {!isLoading && !error && availableCount > 0 && (
        <div className="absolute top-2 left-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>
      )}

      {/* Click hint */}
      {!isLoading && !error && (
        <div className="mt-3 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to view details
        </div>
      )}

      {/* Retry Button for Errors */}
      {error && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            fetchData()
          }}
          className="mt-3 text-xs text-green-500 hover:text-green-600 underline transition-colors duration-200"
        >
          Retry
        </button>
      )}

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  )
}
