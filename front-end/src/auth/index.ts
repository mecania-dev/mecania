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
  const { refresh } = await getTokens()
  // This logic ensures the user is authenticated if either:
  // 1. There is a refresh token (allowing the client to get a new access token).
  // 2. Both access and refresh tokens are present.
  // Checking only `!!access && !!refresh` would prevent the client from refreshing
  // the access token if it's missing or expired. Prioritizing the refresh token ensures session renewal when possible.
  return !!refresh
}

export async function auth({ groups, unauthorizedGroups, redirectUrl, custom }: AuthProps = {}) {
  const session = await getSession()
  const isAuthed = await isAuthenticated()
  let authorized = isAuthed
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

  const customRes = await maybePromise(custom, { user, isAuthenticated: isAuthed, setRedirectUrl })

  if (customRes != null) {
    authorized = customRes
  }

  if (!authorized && realRedirectUrl) redirect(realRedirectUrl)
  return authorized
}
