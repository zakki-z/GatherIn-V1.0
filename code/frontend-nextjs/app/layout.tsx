import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
    title: 'Chat Application',
    description: 'Real-time chat application',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50">
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
