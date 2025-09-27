import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RoomApp - Hotel Management System',
  description: 'Complete hotel management solution with QR-based guest services',
  icons: {
    icon: '/favicon.svg',
  },
}

import DataInitializer from '@/components/DataInitializer'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataInitializer />
        <div className="min-h-screen bg-gradient-to-br from-hotel-cream to-white max-w-screen-lg mx-auto px-2 sm:px-4 md:px-8">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </div>
      </body>
    </html>
  )
}
