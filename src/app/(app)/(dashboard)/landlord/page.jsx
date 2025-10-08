import Header from '@/app/(app)/Header'

export const metadata = {
  title: 'nyumba',
}

export default function LandlordDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Listings', value: 12 },
            { title: 'Booked Units', value: 6 },
            { title: 'Available Units', value: 5 },
            { title: 'Pending Requests', value: 3 },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white shadow-md rounded-xl p-5 text-center"
            >
              <h3 className="text-sm text-gray-500">{card.title}</h3>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Section: Property Actions */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Properties</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              + Add New Property
            </button>
          </div>

          {/* Placeholder: Property List */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((id) => (
              <div key={id} className="bg-white p-5 shadow rounded-xl">
                <h3 className="text-lg font-semibold mb-2">2 Bedroom Apartment</h3>
                <p className="text-sm text-gray-600 mb-2">Location: Area 25, Lilongwe</p>
                <p className="text-sm text-gray-600 mb-2">Status: <span className="text-green-600">Vacant</span></p>
                <p className="text-sm text-gray-600 mb-4">Price: MK 150,000/month</p>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Bookings */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>
          <div className="bg-white shadow rounded-xl p-5">
            <p>No new requests at the moment.</p>
          </div>
        </section>

        {/* Section: Payments */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="bg-white shadow rounded-xl p-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Tenant</th>
                  <th className="py-2">Property</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[].map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">John Doe</td>
                    <td className="py-2">Apartment 3A</td>
                    <td className="py-2">MK 150,000</td>
                    <td className="py-2 text-green-600">Paid</td>
                    <td className="py-2">July 2025</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="text-gray-500 py-4 text-center">
                    No recent payments.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
