'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black/75 rounded-2xl shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow">
                    Forgot Password
                </h2>

                <div className="mb-4 text-sm text-gray-200">
                    No problem! Just enter your email address and we’ll send you a password reset link.
                </div>

                <AuthSessionStatus className="mb-4 text-green-400 text-sm" status={status} />

                <form onSubmit={submitForm} className="space-y-6">
                    <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            className="mt-1 w-full bg-gray-100 text-black/85 border border-black/90 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />
                        <InputError messages={errors.email} className="mt-2 text-red-500 text-sm" />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-gray-900 font-bold px-5 py-2 rounded-xl hover:brightness-110 transition-all shadow-md">
                            Send Reset Link
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Page
