
import Header from '@/app/(app)/Header'

import TotalListings from '@/components/dashboard/TotalListings'
import BookedUnits from '@/components/dashboard/BookedUnits'
import AvailableUnits from '@/components/dashboard/AvailableUnits'
import PendingRequests from '@/components/dashboard/PendingRequests'

import YourPropertiesSection from '@/components/dashboard/YourProperties'
import BookingRequests from '@/components/dashboard/BookingRequests'
import RecentPayments from '@/components/dashboard/RecentPayments'

export const metadata = {
  title: 'landlord - Dashboard',
}

export default function TenantDashboard() {
  return (
    <div className="min-h-screen  text-gray-800">
      <Header />

      <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TotalListings count={12} />
          <BookedUnits count={6} />
          <AvailableUnits count={5} />
          <PendingRequests count={3} />
        </div>

        {/* ✅ Add Property Section */}
        <YourPropertiesSection />

        {/* Booking Requests */}
        <BookingRequests />

        {/* Payments Section */}
        <RecentPayments />
      </main>
    </div>
  )
}
