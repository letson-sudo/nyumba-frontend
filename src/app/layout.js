import { Nunito } from 'next/font/google'
import '@/app/global.css'
import { FormDataProvider } from '@/components/context/FormContext'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">
            <FormDataProvider>
          {children}
        </FormDataProvider>
                </body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
