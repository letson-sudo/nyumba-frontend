'use client'

import React from 'react'
import {Button} from '../ui/button'
import { useRouter } from 'next/navigation'

const ReviewButton = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/reviewdashboard') // This assumes /app/(app)/reviewdashboard/page.jsx exists
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        className="px-4 py-2"
      >
        Review Listing
      </Button>
    </div>
  )
}

export default ReviewButton
