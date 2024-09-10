'use client'

import { ConfirmationModal } from '@/components/feedback/confirmation-modal'
import { Toaster } from '@/components/toast/toaster'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <NextUIProvider navigate={router.push} className="flex grow flex-col">
        <UserProvider>
          {children}
          <ConfirmationModal />
          <Toaster />
        </UserProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}
