'use server'

import { isAuthorizedRoute } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthorizedRouteAction(pathname: string) {
  const callbackUrl = cookies().get('callback-url')?.value
  return await isAuthorizedRoute(pathname, {
    unauthorized: {
      onUnauthorized: () => redirect(callbackUrl ?? '/')
    },
    authorized: {
      onUnauthorized: isAuthenticated => redirect(isAuthenticated ? '/profile' : '/sign-in')
    }
  })
}
