'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRentals() {
      try {
        const res = await fetch('/api/admin/rentals') // Adjust if calling external API
        const data = await res.json()
        setRentals(data)
      } catch (error) {
        console.error('Failed to fetch rentals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">All Tenant Rentals</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : rentals.length === 0 ? (
          <p className="text-gray-500">No rentals found.</p>
        ) : (
          <div className="bg-white shadow rounded-xl p-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Tenant ID</th>
                  <th className="py-2">House ID</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Payment Method</th>
                  <th className="py-2">Payment Date</th>
                  <th className="py-2">Start Date</th>
                  <th className="py-2">End Date</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">{rental.tenant_id}</td>
                    <td className="py-2">{rental.house_id}</td>
                    <td className="py-2">{rental.amount}</td>
                    <td className="py-2">{rental.payment_method}</td>
                    <td className="py-2">{rental.payment_date}</td>
                    <td className="py-2">{rental.start_date}</td>
                    <td className="py-2">{rental.end_date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
