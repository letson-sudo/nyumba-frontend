import Header from '@/app/Header'
import Homeslider from '@/components/Homeslider'
import SalesCatalog from '@/components/SalesCatalog'
import RepaireCenterServices from '@/components/RepaireCenterServices'
import NetworkingServices from '@/components/NetworkingServices'
import SoftwareDevelopment from '@/components/SoftwareDevelopment'
import FloatingChatInput from '@/components/FloatingChatInput'
import Footer from '@/app/Footer'

export const metadata = {
title: 'TechConnectMalawi',
}

const Home = () => {
return (
    <>
    <div className='bg-gray-200'>
    <Header />
    </div>


    <div>
        <Homeslider />
    </div>  

    <div>
        <SalesCatalog />
    </div>  

    <div>
        <RepaireCenterServices />
    </div>

    <div>
        <NetworkingServices />
    </div>

    <div>
        <SoftwareDevelopment />
    </div>

    <div>
        <FloatingChatInput />
    </div>

    <div>
        <Footer />
    </div>
    </>
)
}

export default Home
