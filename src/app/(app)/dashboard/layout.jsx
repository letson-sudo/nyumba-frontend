// 'use client'
// import Header from '@/app/(app)/Header'
// import React, { useState } from 'react'

// // SVG Icon Components
// const DashboardIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l8-8" />
//   </svg>
// )

// const MessagesIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//   </svg>
// )

// const NotificationsIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z" />
//     <circle cx="19" cy="5" r="3" fill="currentColor" />
//   </svg>
// )

// const ProfileIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// )

// const SupportIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// )

// const LogoutIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//   </svg>
// )


// export default function DashboardLayout({ children }) {
//   const [activeItem, setActiveItem] = useState('dashboard')

//   const handleNavClick = (itemKey) => {
//     setActiveItem(itemKey)
//   }

//   const navigationItems = [
//     {
//       key: 'dashboard',
//       label: 'Dashboard',
//       icon: DashboardIcon,
//       isMainDashboard: true
//     },
//     {
//       key: 'messages',
//       label: 'Messages',
//       icon: MessagesIcon
//     },
//     {
//       key: 'notifications',
//       label: 'Notifications',
//       icon: NotificationsIcon
//     },
//     {
//       key: 'profile',
//       label: 'Profile',
//       icon: ProfileIcon
//     },
//     {
//       key: 'support',
//       label: 'Help & Support',
//       icon: SupportIcon
//     }
//   ]

//   return (
//     <div className="h-screen flex flex-col overflow-hidden">
//       {/* Top Header - Fixed */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         {/* <Header /> */}
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar - Fixed */}
//         <aside className="w-72 bg-white shadow-lg border-r border-gray-200/60 backdrop-blur-sm flex-shrink-0">
//           <div className="h-full overflow-y-auto">
//             <nav className="p-6 space-y-3">
//               {/* Navigation Items */}
//               {navigationItems.map((item) => {
//                 const Icon = item.icon
//                 const active = activeItem === item.key

//                 return (
//                   <button
//                     key={item.key}
//                     onClick={() => handleNavClick(item.key)}
//                     className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md w-full text-left ${
//                       active
//                         ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200/50'
//                         : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                   >
//                     <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors ${
//                       active
//                         ? 'bg-blue-200/50 text-blue-600'
//                         : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
//                     }`}>
//                       <Icon className="w-5 h-5" />
//                     </div>
//                     <span className="font-medium text-sm tracking-wide">
//                       {item.label}
//                     </span>
//                     {active && (
//                       <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                     )}
//                   </button>
//                 )
//               })}

//               {/* Divider */}
//               <div className="my-6 border-t border-gray-200"></div>

//               {/* Logout */}
//               <button
//                 onClick={() => console.log('Logout clicked')}
//                 className="group flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md w-full text-left"
//               >
//                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 mr-3 transition-colors">
//                   <LogoutIcon className="w-5 h-5" />
//                 </div>
//                 <span className="font-medium text-sm tracking-wide">
//                   Logout
//                 </span>
//               </button>
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content - Scrollable */}
//         <main className="flex-1 bg-white overflow-y-auto">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-8">
//             <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200/60">
//               <div className="p-6 sm:p-8">
//                 {children}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }




'use client'
import React, { useState } from 'react'

// SVG Icon Components
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l8-8" />
  </svg>
)

const MessagesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const NotificationsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z" />
    <circle cx="19" cy="5" r="3" fill="currentColor" />
  </svg>
)

const ProfileIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const SupportIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)


export default function DashboardLayout({ children }) {
  const [activeItem, setActiveItem] = useState('dashboard')

  const handleNavClick = (itemKey) => {
    setActiveItem(itemKey)
  }

  const navigationItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      isMainDashboard: true
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: MessagesIcon
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: NotificationsIcon
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: ProfileIcon
    },
    {
      key: 'support',
      label: 'Help & Support',
      icon: SupportIcon
    }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <Header /> */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed */}
        <aside className="w-72 bg-white shadow-lg border-r border-gray-200/60 backdrop-blur-sm flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <nav className="p-6 space-y-3">
              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = activeItem === item.key

                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md w-full text-left ${
                      active
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200/50'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-colors ${
                      active
                        ? 'bg-blue-200/50 text-blue-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm tracking-wide">
                      {item.label}
                    </span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </button>
                )
              })}

              {/* Divider */}
              <div className="my-6 border-t border-gray-200" />

              {/* Logout */}
              <button
                onClick={() => {}}
                className="group flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md w-full text-left"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500 mr-3 transition-colors">
                  <LogoutIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm tracking-wide">
                  Logout
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 sm:py-8">
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200/60">
              <div className="p-6 sm:p-8">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
