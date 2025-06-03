'use client'

const SkeletonMessageLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  )
}

export default SkeletonMessageLoader
