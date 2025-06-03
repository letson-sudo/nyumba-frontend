"use client"
import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-4 bg-gray-300 rounded"></div>
      ))}
    </div>
  )
}

export default SkeletonLoader