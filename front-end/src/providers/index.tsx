'use client'

import { useLayoutEffect, useState } from 'react'

import Loading from '@/app/loading'
import { ConfirmationModal } from '@/components/modal'
import { Toaster } from '@/components/toast/toaster'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'

import { isAuthorizedRouteAction } from './auth-action'
import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <NextUIProvider navigate={router.push} className="flex grow flex-col">
        <UserProvider>
          <Authorize>
            {children}
            <ConfirmationModal />
            <Toaster />
          </Authorize>
        </UserProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}

function Authorize({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useLayoutEffect(() => {
    isAuthorizedRouteAction(pathname).then(setIsAuthorized)
  }, [pathname])

  if (!isAuthorized) return <Loading />

  return children
}
