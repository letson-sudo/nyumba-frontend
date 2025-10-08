import Header from '@/app/(app)/Header'
import ServiceProviderDashboard from '@/components/service-provider/ServiceProviderDashboard'
import FloatingMessageButton from './chat/FloatingMessageButton'

export const metadata = {
    title: 'vendor - Dashboard',
}

const Dashboard = () => {
    return (
        <>
            {/* <Header title="Dashboard" /> */}
            <div className="py-12">
            <ServiceProviderDashboard /> 
            </div> 

            <div>
                {/* <FloatingMessage /> */}
            </div>

            <div>
                <FloatingMessageButton />
            </div>
        </>
    )
}

export default Dashboard