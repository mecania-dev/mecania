import { maybePromise } from '@/lib/promise'
import { User } from '@/types/entities/user'
import { redirect } from 'next/navigation'

import { getSession } from './session'
import { getTokens } from './token'
import { AuthProps } from './types'

export * from './types'
export * from './session'
export * from './token'
export * from './casl'
export * from './get-user-permissions'

export async function isAuthenticated() {
  const { access, refresh } = await getTokens()
  return !!access && !!refresh
}

export async function auth({ groups, unauthorizedGroups, redirectUrl, custom }: AuthProps = {}) {
  const session = await getSession()
  const isAuthenticated = !!session
  let authorized = isAuthenticated
  let user: User | undefined
  let realRedirectUrl: string | undefined = redirectUrl ?? '/sign-in'

  if (session) {
    user = session

    if (groups?.length) {
      authorized = groups.some(g => session.groups.includes(g))
    } else if (unauthorizedGroups?.length) {
      authorized = !unauthorizedGroups.some(g => session.groups.includes(g))
    }
  }

  function setRedirectUrl(url?: string) {
    realRedirectUrl = url
  }

  const customRes = await maybePromise(custom, { user, isAuthenticated, setRedirectUrl })

  if (customRes != null) {
    authorized = customRes
  }

  if (!authorized && realRedirectUrl) redirect(realRedirectUrl)
  return authorized
}
