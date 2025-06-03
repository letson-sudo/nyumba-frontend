'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black/75 rounded-2xl shadow-lg p-8">
                <h2 className="text-center text-2xl font-bold mb-6 bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow">
                    Create Your TechConnect Account
                </h2>

                <form onSubmit={submitForm} className="space-y-6">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            className="mt-1 w-full bg-blue-100 text-black/85 border border-black/90 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setName(event.target.value)}
                            required
                            autoFocus
                        />
                        <InputError messages={errors.name} className="mt-2 text-red-500 text-sm" />
                    </div>

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
                            className="mt-1 w-full bg-blue-100 text-black/85 border border-black/90 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <InputError messages={errors.password} className="mt-2 text-red-500 text-sm" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label htmlFor="passwordConfirmation" className="text-white">Confirm Password</Label>
                        <Input
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            className="mt-1 w-full bg-blue-100 text-black/85 border border-black/90 focus:border-yellow-400 focus:ring-yellow-400"
                            onChange={event => setPasswordConfirmation(event.target.value)}
                            required
                        />
                        <InputError messages={errors.password_confirmation} className="mt-2 text-red-500 text-sm" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/login"
                            className="text-sm text-gray-100 hover:text-yellow-400"
                        >
                            Already registered?
                        </Link>

                        <Button className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-gray-900 font-bold px-5 py-2 rounded-xl hover:brightness-110 transition-all shadow-md">
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Page
