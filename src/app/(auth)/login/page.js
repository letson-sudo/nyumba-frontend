// 'use client'

// import Button from '@/components/Button'
// import Input from '@/components/Input'
// import InputError from '@/components/InputError'
// import Label from '@/components/Label'
// import Link from 'next/link'
// import { useAuth } from '@/hooks/auth'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
// import AuthCard from '@/components/ui/AuthCard'



// const Login = () => {
//     const router = useRouter()

//     const { login } = useAuth({
//         middleware: 'guest',
//         redirectIfAuthenticated: '/tenant',
//     })

//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [shouldRemember, setShouldRemember] = useState(false)
//     const [errors, setErrors] = useState([])
//     const [status, setStatus] = useState(null)

//     useEffect(() => {
//         if (router.reset?.length > 0 && errors.length === 0) {
//             setStatus(atob(router.reset))
//         } else {
//             setStatus(null)
//         }
//     }, [router.reset, errors])

//     const submitForm = async event => {
//         event.preventDefault()

//         login({
//             email,
//             password,
//             remember: shouldRemember,
//             setErrors,
//             setStatus,
//         })
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
//             <AuthCard>
//                 <div className='flex items-center justify-center' />
//                  <h1 className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-2xl mb-7">
//     Login to Nyumba
//   </h1>
//                 <AuthSessionStatus className="mb-4 text-sm text-green-500" status={status} />

//                 <form onSubmit={submitForm} className="space-y-4">
//                     {/* Email */}
//                     <div>
//                         <Label htmlFor="email">Email</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             value={email}
//                             className="mt-1 w-full"
//                             onChange={event => setEmail(event.target.value)}
//                             required
//                             autoFocus
//                         />
//                         <InputError messages={errors.email} className="mt-2" />
//                     </div>

//                     {/* Password */}
//                     <div>
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                             id="password"
//                             type="password"
//                             value={password}
//                             className="mt-1 w-full"
//                             onChange={event => setPassword(event.target.value)}
//                             required
//                             autoComplete="current-password"
//                         />
//                         <InputError messages={errors.password} className="mt-2" />
//                     </div>

//                     {/* Remember Me */}
//                     <div className="flex items-center">
//                         <input
//                             id="remember_me"
//                             type="checkbox"
//                             name="remember"
//                             className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
//                             onChange={event => setShouldRemember(event.target.checked)}
//                         />
//                         <label htmlFor="remember_me" className="ml-2 text-sm text-gray-700">
//                             Remember me
//                         </label>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-between">
//                         <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
//                             Forgot password?
//                         </Link>

//                         <Button className="bg-blue-500 hover:bg-blue-600 text-gray-700 font-semibold px-5 py-2 rounded-xl transition-all shadow">
//                             Login
//                         </Button>
//                     </div>
//                 </form>

//                 <p className="text-sm text-center mt-6">
//                     Don't have an account?{' '}
//                     <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
//                 </p>
//             </AuthCard>
//         </div>
//     )
// }

// export default Login


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



const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/tenant',
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
            <AuthCard>
                <div className='flex items-center justify-center' />
                 <h1 className="flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-transparent text-2xl mb-7">
    Login to Nyumba
  </h1>
                <AuthSessionStatus className="mb-4 text-sm text-green-500" status={status} />

                <form onSubmit={submitForm} className="space-y-4">
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
                            autoFocus
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
                            autoComplete="current-password"
                        />
                        <InputError messages={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                            onChange={event => setShouldRemember(event.target.checked)}
                        />
                        <label htmlFor="remember_me" className="ml-2 text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </Link>

                        <Button className="bg-blue-500 hover:bg-blue-600 text-gray-700 font-semibold px-5 py-2 rounded-xl transition-all shadow">
                            Login
                        </Button>
                    </div>
                </form>

                <p className="text-sm text-center mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </AuthCard>
        </div>
    )
}

export default Login
