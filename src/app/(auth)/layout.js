
import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'

export const metadata = {
    title: 'nyumba',
}

const Layout = ({ children }) => {
    return (
        <div>
            <div className="">
                <AuthCard
                    logo={
                        <Link href="/" >
                            <ApplicationLogo className="" />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
