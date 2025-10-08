'use client'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100-; flex flex-col">
            {/* Fixed top navigation */}
            <Navigation user={user} />

            {/* Scrollable content area */}
            <main className="flex-1 px-4 sm:px-6 md:px-8 py-6">
                {children}
            </main>
        </div>
    )
}

export default AppLayout
