"use client"
import React, { useState } from 'react'


const FloatingMessage = ({ messages, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
          />
        </svg>
      </button>

      {/* Chat Box */}
      {!isOpen ? null : (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <SkeletonLoader />
            ) : messages && messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {msg}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center">
                No messages available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingMessage