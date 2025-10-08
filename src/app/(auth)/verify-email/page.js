'use client'

import Button from '@/components/Button'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import AuthCard from '@/components/ui/AuthCard'


const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [status, setStatus] = useState(null)

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
             <AuthCard>
                <h2 className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-2xl mb-7">
                    Verify Your Email
                </h2>

                <div className="mb-4 text-sm text-gray-800">
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
                    >
                        Resend Email
                    </Button>

                    <button
                        type="button"

                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
           </AuthCard>
        </div>
    )
}

export default Page
