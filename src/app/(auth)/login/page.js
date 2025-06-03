'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    }, [router.reset, errors])

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black/75 rounded-2xl shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow">
                    Welcome Back to TechConnect Malawi
                </h2>

                <AuthSessionStatus className="mb-4 text-sm text-green-500" status={status} />

                <form onSubmit={submitForm} className="space-y-6">
                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="mt-1 w-full bg-blue-100 text-black/85 border border-black/90 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />
                        <InputError messages={errors.email} className="mt-2 text-red-500 text-sm" />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="mt-1 w-full bg-blue-100 text-white border border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <InputError messages={errors.password} className="mt-2 text-red-500 text-sm" />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-200 text-yellow-500 focus:ring-yellow-400"
                            onChange={event => setShouldRemember(event.target.checked)}
                        />
                        <label htmlFor="remember_me" className="ml-2 text-sm text-gray-200">
                            Remember me
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link href="/forgot-password" className="text-sm text-gray-100 hover:text-yellow-400">
                            Forgot password?
                        </Link>

                        <Button className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-gray-900 font-bold px-5 py-2 rounded-xl hover:brightness-110 transition-all shadow-md">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
