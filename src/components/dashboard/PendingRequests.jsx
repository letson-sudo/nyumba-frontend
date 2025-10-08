import { Clock, TrendingUp } from 'lucide-react'

export default function PendingRequests({ count = 0 }) {
  return (
    <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>

      {/* Floating Icon Background */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-300"></div>

      {/* Header with Icon */}
      <div className="relative flex items-center justify-center gap-3 mb-4">
        <div className="bg-blue-500 p-3 rounded-full shadow-lg group-hover:bg-blue-600 transition-colors duration-300">
          <Clock className="text-white" size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            Pending Requests
          </h3>
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <TrendingUp size={12} />
            <span>Awaiting Review</span>
          </div>
        </div>
      </div>

      {/* Count Display */}
      <div className="relative">
        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300 mb-2">
          {count.toLocaleString()}
        </p>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-xs text-gray-500 font-medium">
            {count > 0 ? 'Action Required' : 'All Clear'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {count > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-3/4 animate-pulse"></div>
        </div>
      )}

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
    </div>
  )
}
