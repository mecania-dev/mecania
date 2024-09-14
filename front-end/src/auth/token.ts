import { env } from '@/env'
import { refreshToken } from '@/http'
import { cookies } from '@/lib/cookies'
import { jwtDecode } from 'jwt-decode'

import { clearSession } from './session'

export const ACCESS_TOKEN_NAME = 'access_token'
export const REFRESH_TOKEN_NAME = 'refresh_token'

export async function getValidAccessToken(forceRefresh = false) {
  const { access, refresh } = await getTokens()
  if (!refresh) {
    await clearSession()
    await clearTokens()
    return
  }

  if (access && !forceRefresh && !isTokenExpired(access)) return access

  const res = await refreshToken({ refresh })

  if (!res.ok) {
    await clearSession()
    await clearTokens()
    return
  }

  const { access: newAccess, refresh: newRefresh } = res.data
  await setTokens(newAccess, newRefresh)
  return newAccess
}

export function isTokenExpired(token: string) {
  return Date.now() >= getTokenExpiration(token) * 1000
}

export function getTokenExpiration(token?: string) {
  if (!token) return 0

  try {
    const decoded = jwtDecode(token)
    return decoded.exp ?? 0
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
