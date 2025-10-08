'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import AuthCard from '@/components/ui/AuthCard'


const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/tenant',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <AuthCard>

                <h2 className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-2xl mb-7">
                    Forgot Password
                </h2>

                <div className="mb-4 text-sm text-gray-800">
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
                            className="mt-1 w-full bg-gray-100 text-black/85 border border-black/90 focus:border-blue-400 focus:ring-blue-400"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />
                        <InputError messages={errors.email} className="mt-2 text-red-500 text-sm" />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button className="">
                            Send Reset Link
                        </Button>
                    </div>
                </form>
         </AuthCard>
        </div>
    )
}

export default Page
