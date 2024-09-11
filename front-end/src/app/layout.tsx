import './globals.css'

import { Providers } from '@/providers'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Home - MecanIA',
    template: '%s - MecanIA'
  },
  icons: {
    icon: '/logo.svg'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-[100dvh] flex-col overflow-auto scroll-smooth bg-default-50 text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
