import { env } from '@/env'
import { refreshToken } from '@/http'
import { cookies } from '@/lib/cookies'
import { jwtDecode } from 'jwt-decode'
import { unstable_noStore as noStore } from 'next/cache'

import { clearSession, setSession } from './session'

export const ACCESS_TOKEN_NAME = 'access_token'
export const REFRESH_TOKEN_NAME = 'refresh_token'

let isRefreshing = false

export async function waitTokenRefresh() {
  noStore()
  if (isRefreshing) {
    console.log('Waiting for token refresh...')
    while (isRefreshing) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    console.log('Token refreshed!')
    await waitTokenRefresh()
  }
}

export async function getValidAccessToken(forceRefresh = false) {
  if (isRefreshing) {
    await waitTokenRefresh()
    const { access: newAccess } = await getTokens()
    return newAccess
  } else {
    const { access, refresh } = await getTokens()

    if (!refresh) {
      await clearSession()
      await clearTokens()
      return
    }

    if (access && !forceRefresh && !isTokenExpired(access)) return access

    isRefreshing = true
    const res = await refreshToken({ refresh })
    isRefreshing = false

    if (!res.ok) {
      await clearSession()
      await clearTokens()
      return
    }

    const { access: newAccess, refresh: newRefresh, user } = res.data
    await setTokens(newAccess, newRefresh)
    await setSession(user, newAccess)
    return newAccess
  }
}

export function isTokenExpired(token: string, offset?: number) {
  return getTokenExpiresIn(token, offset) <= 0
}

export function getTokenExpiresIn(token?: string, offset?: number) {
  const expiresIn = getTokenExpiration(token, offset) * 1000 - Date.now()
  return expiresIn
}

// offset -> seconds before expiration
// default 160 seconds, the time difference between the client and the server
export function getTokenExpiration(token?: string, offset = 160) {
  if (!token) return 0

  try {
    const decoded = jwtDecode(token)
    if (!decoded.exp) return 0
    return decoded.exp > offset ? decoded.exp - offset : 0
  } catch {
    return 0
  }
}

export async function getTokens() {
  return await cookies({ access: ACCESS_TOKEN_NAME, refresh: REFRESH_TOKEN_NAME })
}

export async function setTokens(access?: string, refresh?: string) {
  if (access && refresh) {
    await cookies.set({ [ACCESS_TOKEN_NAME]: access, [REFRESH_TOKEN_NAME]: refresh }, (_, value) => ({
      maxAge: getTokenExpiration(value) - Date.now() / 1000,
      path: '/',
      secure: !env.NEXT_PUBLIC_DEVELOPMENT,
      sameSite: 'strict'
    }))
  }
}

export async function clearTokens() {
  await cookies.delete([ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME])
}
