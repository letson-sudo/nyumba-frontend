

// import { Nunito } from 'next/font/google'
// import '@/app/global.css'
// import { FormDataProvider } from '@/components/context/FormContext'
// import Footer from './Footer'


// const nunitoFont = Nunito({
//     subsets: ['latin'],
//     display: 'swap',
// })

// export const metadata = {
//     title: 'Nyumba',
//     description: 'Find your perfect home easily',
// }

// const RootLayout = ({ children }) => {
//     return (
//         <html lang="en" className={nunitoFont.className}>
//             <head>
//                 <link rel="manifest" href="/manifest.json" />
//                 <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
//             </head>
//             <body className="antialiased bg-white text-gray-900">
//                 <FormDataProvider>
//                     {children}

//                     {/* <Footer/> */}
//                 </FormDataProvider>


//             </body>
//         </html>
//     )
// }

// export default RootLayout



import { Nunito } from 'next/font/google'
import '@/app/global.css'
import { FormDataProvider } from '@/components/context/FormContext'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: 'Nyumba',
    description: 'Find your perfect home easily',
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            </head>
            <body className="antialiased bg-white text-gray-900">
                <FormDataProvider>
                    {children}
                    {/* <Footer/> */}
                </FormDataProvider>
            </body>
        </html>
    )
}

export default RootLayout
