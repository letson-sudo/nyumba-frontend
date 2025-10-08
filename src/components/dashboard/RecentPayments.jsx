// components/dashboard/RecentPayments.jsx

export default function RecentPayments() {
  return (
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
            <tr>
              <td colSpan={5} className="text-gray-500 py-4 text-center">
                No recent payments.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
