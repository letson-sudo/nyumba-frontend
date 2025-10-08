import Header from '@/app/(app)/Header'
import Page from '@/app/(public)/landing/page'


export const metadata = {
title: 'Nyumba',
icons: {
    icon: '/nyumba.png',
    shortcut: '/nyumba1.png',
},
}

const Home = () => {
return (
    <>
    <div>
    <Header />
    </div>

    <div className='mt-6'>
        <Page />
    </div>



    </>
)
}

export default Home

