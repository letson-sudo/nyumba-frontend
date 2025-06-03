'use client'

import Button from '@/components/Button'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [status, setStatus] = useState(null)

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black/75 rounded-2xl shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow">
                    Verify Your Email
                </h2>

                <div className="mb-4 text-sm text-gray-200">
                    Thanks for signing up! Before getting started, please verify
                    your email address by clicking on the link we just sent to your inbox.
                    If you didn’t receive the email, we’ll gladly send another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 font-medium text-sm text-green-400">
                        A new verification link has been sent to your email.
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <Button
                        onClick={() => resendEmailVerification({ setStatus })}
                        className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-gray-900 font-bold px-4 py-2 rounded-xl hover:brightness-110 transition-all shadow-md"
                    >
                        Resend Email
                    </Button>

                    <button
                        type="button"
                        className="underline text-sm text-gray-300 hover:text-yellow-400 transition-all"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page
