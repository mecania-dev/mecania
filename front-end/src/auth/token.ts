import { cookies } from '@/lib/cookies'
import { jwtDecode, JwtPayload } from 'jwt-decode'

import { refreshTokenAction } from './actions'
import { clearSession } from './session'

export async function getValidAccessToken(forceRefresh = false) {
  const { access, refresh } = await getTokens()
  if (!refresh) {
    await clearSession()
    await clearTokens()
    return
  }

  if (access && !forceRefresh) {
    const isExpired = await isTokenExpired(access)
    if (!isExpired) return access
  }

  return await refreshTokenAction({ refresh })
}

export async function isTokenExpired(token: string) {
  let decoded: JwtPayload | undefined

  try {
    decoded = jwtDecode(token)
  } catch {
    return true
  }

  const now = Date.now()
  const expiration = (decoded?.exp ?? now) * 1000
  return now >= expiration
}

export async function getTokens() {
  return await cookies({ access: 'access_token', refresh: 'refresh_token' })
}

export async function setTokens(access?: string, refresh?: string) {
  if (access && refresh) {
    await cookies.set({ access_token: access, refresh_token: refresh })
  }
}

export async function clearTokens() {
  await cookies.delete(['access_token', 'refresh_token'])
}
