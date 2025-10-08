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
import AuthCard from '@/components/ui/AuthCard'

const Register = () => {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <AuthCard>
                        <h1 className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-2xl mb-7">
    Register for Nyumba
  </h1>
                <form onSubmit={submitForm} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            className="mt-1 w-full"
                            onChange={event => setName(event.target.value)}
                            required
                            autoFocus
                        />
                        <InputError messages={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="mt-1 w-full"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <InputError messages={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                        <Input
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            className="mt-1 w-full"
                            onChange={event => setPasswordConfirmation(event.target.value)}
                            required
                        />
                        <InputError messages={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link href="/login" className="text-sm text-blue-500 hover:underline">
                            Already registered?
                        </Link>

                        <Button className="bg-green-500 hover:bg-green-600 text-gray-700 font-semibold px-5 py-2 rounded-xl transition-all shadow">
                            Register
                        </Button>
                    </div>
                </form>
            </AuthCard>
        </div>
    )
}

export default Register
