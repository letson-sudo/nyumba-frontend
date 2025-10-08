'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/app/(app)/Header'
import Footer from '../../Footer'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  // Handle mobile detection and sidebar behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const navigationItems = [
    {
      href: '/tenant',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      isSpecial: true
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      ),
      badge: '3'
    },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      ),
      badge: '1'
    },
    {
      href: '/maintenance',
      label: 'Maintenance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
      )
    },
    {
      href: '/payments',
      label: 'Payments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      )
    },
    {
      href: '/documents',
      label: 'Documents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    }
  ]

  const supportItems = [
    {
      href: '/support',
      label: 'Help Center',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      )
    },
    {
      href: '/logout',
      label: 'Sign Out',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      ),
      isLogout: true
    }
  ]

  return (
    // Changed: Added flex flex-col to make footer stick to bottom
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Top Header */}
      <Header />

      {/* Changed: Added flex-1 to make this section take remaining space */}
      <div className="flex flex-1">
        {/* Mobile Backdrop */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside className={`
          ${isMobile
            ? `fixed left-0 top-0 h-full w-72 z-50 transform transition-all duration-300 ease-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'sticky top-0 h-screen w-72 hidden md:block'
          }
        `}>
          <div className="h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl shadow-slate-200/50">
            {/* Mobile Header */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex flex-col h-full p-4 space-y-6 overflow-y-auto">
              {/* Main Navigation */}
              <nav className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Dashboard
                </div>
                {navigationItems.map((item) => {
                  const active = item.isSpecial
                    ? (isActive('/tenant') || isActive('/landlord') || isActive('/admin'))
                    : isActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        group relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${active
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
                      `}
                    >
                      <span className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                          active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Support Section */}
              <div className="border-t border-gray-100 pt-6 mt-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Support
                </div>
                <div className="space-y-1">
                  {supportItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${item.isLogout
                          ? 'text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500/20'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                      `}
                    >
                      <span className={`flex-shrink-0 ${item.isLogout ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        {/* Changed: Added flex flex-col to allow footer positioning */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                )}
              </svg>
            </button>
          </div>

          {/* Page Content */}
          {/* Changed: Added flex-1 to take remaining space */}
          <main className="flex-1">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>


        </div>
      </div>
      {/* Footer - now inside the flex container */}
          <Footer />
    </div>
  )
}
