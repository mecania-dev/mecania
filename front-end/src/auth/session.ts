import { env } from '@/env'
import { cookies } from '@/lib/cookies'
import { User } from '@/types/entities/user'

import { getTokenExpiration } from './token'

export async function getSession() {
  const sessionJson = await cookies('session')
  if (sessionJson) {
    try {
      return JSON.parse(sessionJson) as User
    } catch {}
  }
}

export async function setSession(user?: User, access?: string) {
  if (user && access) {
    await cookies.set(
      { session: user },
      {
        maxAge: getTokenExpiration(access) - Date.now() / 1000,
        path: '/',
        secure: !env.NEXT_PUBLIC_DEVELOPMENT,
        sameSite: 'strict'
      }
    )
  }
}

export async function clearSession() {
  await cookies.delete('session')
}
