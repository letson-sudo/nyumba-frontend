import Header from '@/app/(app)/Header'

export const metadata = {
  title: 'Admin - Dashboard',
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {/* Dashboard Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Tenants', value: 210 },
              { title: 'Total Landlords', value: 45 },
              { title: 'Total Listings', value: 180 },
              { title: 'Payments (This Month)', value: 'MK 3,200,000' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white shadow-md rounded-xl p-5 text-center"
              >
                <h3 className="text-sm text-gray-500">{item.title}</h3>
                <p className="text-2xl font-bold mt-2">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white shadow rounded-xl p-5 space-y-3">
            <p className="text-sm text-gray-600">• New tenant registered: <strong>Chisomo Banda</strong></p>
            <p className="text-sm text-gray-600">• Listing approved: <strong>Brick-Face 2BR in Blantyre</strong></p>
            <p className="text-sm text-gray-600">• Payment received: <strong>MK 150,000</strong> from <strong>John Zimba</strong></p>
          </div>
        </section>

        {/* User Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              View All Users
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-1">Promote Tenant</h3>
              <p className="text-sm text-gray-500">Change role of tenant to landlord.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-1">Ban/Unban Account</h3>
              <p className="text-sm text-gray-500">Restrict access for rule-breaking users.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-700 mb-1">Send Notice</h3>
              <p className="text-sm text-gray-500">Broadcast messages to users.</p>
            </div>
          </div>
        </section>

        {/* Listings Moderation */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Listings Moderation</h2>
            <button className="text-blue-600 hover:underline">View All Listings</button>
          </div>
          <div className="bg-white p-5 shadow rounded-lg">
            <p className="text-sm text-gray-500">No flagged listings at the moment.</p>
          </div>
        </section>

        {/* Payments Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="bg-white shadow rounded-xl p-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">User</th>
                  <th className="py-2">Listing</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[].map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">Tenant A</td>
                    <td className="py-2">2BR House in Area 23</td>
                    <td className="py-2">MK 120,000</td>
                    <td className="py-2">17 Jul 2025</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="text-gray-500 py-4 text-center">
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
