import './globals.css'

import { Providers } from '@/providers'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Home - MecanIA',
    template: '%s - MecanIA'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const maxDuration = 60

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-[100dvh] flex-col overflow-auto scroll-smooth bg-default-50 text-foreground scrollbar-h-1.5 scrollbar-w-1.5 scrollbar-thumb-active-secondary/50 scrollbar-thumb-default-300 scrollbar-thumb-hover-default-400 scrollbar-track-transparent">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
