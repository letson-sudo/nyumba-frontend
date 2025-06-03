'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarLayout = ({ children }) => {
    const pathname = usePathname()

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Services', href: '/dashboard/services' },
        { label: 'Orders', href: '/dashboard/orders' },
        { label: 'Profile', href: '/dashboard/profile' },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-black/75 border-r border-gray-200 p-4 space-y-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow-lg mb-6">
                    Service Provider
                    </div>
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 rounded text-sm font-medium ${
                            pathname === item.href
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-200 hover:bg-gray-100 hover:text-black/75'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
    )
}

export default SidebarLayout
