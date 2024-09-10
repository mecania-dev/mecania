import { env } from '@/env'
import { serverCookies } from '@/lib/cookies/server'
import { User } from '@/types/entities/user'

export function isAuthenticated() {
  return !!serverCookies.get('tokens')
}

export async function auth() {
  const token = serverCookies.get('tokens')

  const res = await fetch(env.NEXT_PUBLIC_API_BASE_URL + '/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })

  const data = await res.json()

  if (res.ok) {
    return { ok: true, user: data as User }
  }

  return { ok: false, message: data.message, error: data.error, statusCode: res.status }
}
