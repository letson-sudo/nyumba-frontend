import React from 'react';

// Individual card skeleton component
const CardSkeleton = () => (
  <div className="bg-white shadow-lg rounded-2xl p-5 text-center transition hover:shadow-xl">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded mb-3 w-24 mx-auto"></div>
      <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
    </div>
  </div>
);

// Property card skeleton
const PropertyCardSkeleton = () => (
  <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
    <div className="animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="border-t border-gray-100 pt-3 mt-4">
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-1 bg-gray-200 rounded w-1"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  </div>
);

// Table row skeleton
const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="animate-pulse">
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </td>
  </tr>
);

// Sidebar navigation skeleton
const SidebarSkeleton = () => (
  <aside className="w-full lg:w-72 bg-white shadow-lg border-r border-gray-200/60 backdrop-blur-sm">
    <div className="sticky top-0 h-full">
      <nav className="p-6 space-y-3">
        {/* Navigation Items Skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center px-4 py-3 rounded-xl">
            <div className="animate-pulse flex items-center w-full">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Logout Skeleton */}
        <div className="flex items-center px-4 py-3 rounded-xl">
          <div className="animate-pulse flex items-center w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
);

// Header skeleton
const HeaderSkeleton = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="animate-pulse flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </header>
);

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar Skeleton */}
        <SidebarSkeleton />

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200/60 min-h-[calc(100vh-12rem)]">
                <div className="p-6 sm:p-8">

                  {/* Single Page Content Skeleton */}
                  <div className="animate-pulse space-y-6">
                    {/* Dashboard Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </div>

                    {/* Content Lines */}
                    <div className="space-y-4 mt-8">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>

                    {/* Simple Grid Layout */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="mt-8 space-y-4">
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                      <div className="bg-white p-6 shadow-lg rounded-2xl border border-gray-100">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
