

// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { useAuth } from '@/hooks/auth'
// import Dropdown from '@/components/Dropdown'
// import DropdownLink, { DropdownButton } from '@/components/DropdownLink'

// const LoginLinks = () => {
//     const { user, logout } = useAuth()

//     if (!user) {
//         return (
//             <div className="flex gap-4 items-center">
//                 <Link href="/login" className="text-sm text-gray-800">Login</Link>
//                 <Link href="/register" className="text-sm text-gray-800">Register</Link>
//             </div>
//         )
//     }

//     return (
//         <div className="flex items-center gap-4">
//             <Dropdown
//                 align="right"
//                 width="48"
//                 trigger={
//                     <button className="flex items-center text-sm font-medium text-gray-800 hover:text-gray-600 focus:outline-none">
//                         {user.name}
//                         <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                             <path
//                                 fillRule="evenodd"
//                                 d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                     </button>
//                 }
//             >
//                 <DropdownLink href="/profile">Profile</DropdownLink>
//                 <DropdownButton onClick={logout}>Logout</DropdownButton>
//             </Dropdown>
//         </div>
//     )
// }

// export default LoginLinks




'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Dropdown from '@/components/Dropdown'
import DropdownLink, { DropdownButton } from '@/components/DropdownLink'
import { usePathname } from 'next/navigation'

const LoginLinks = () => {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    if (!user) {
        // Helper to style active/hover links
        const linkClasses = (path) =>
            `relative text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out
             ${pathname === path
                 ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white scale-110 shadow-md'
                 : 'text-gray-800 hover:text-cyan-600 hover:scale-105'}`

        return (
            <div className="flex gap-4 items-center">
                <Link href="/login" className={linkClasses('/login')}>
                    Login
                </Link>
                <Link href="/register" className={linkClasses('/register')}>
                    Register
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Dropdown
                align="right"
                width="48"
                trigger={
                    <button className="flex items-center text-sm font-medium text-gray-800 hover:text-gray-600 focus:outline-none transition-all duration-200">
                        {user.name}
                        <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                }
            >
                <DropdownLink href="/profile">Profile</DropdownLink>
                <DropdownButton onClick={logout}>Logout</DropdownButton>
            </Dropdown>
        </div>
    )
}

export default LoginLinks
