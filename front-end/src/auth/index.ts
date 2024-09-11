import { api } from '@/lib/api'
import { tryParseJSON } from '@/lib/object'
import { User } from '@/types/entities/user'
import { cookies } from 'next/headers'

export interface Tokens {
  refresh: {
    token: string
    expires: string
    issuedAt: string
    expiresIn: number
  }
  access: {
    token: string
    expires: string
    issuedAt: string
    expiresIn: number
  }
}

export async function signIn({ login, password }: { login: string; password: string }) {
  const res = await api.post<{ refresh: Tokens['refresh']; access: Tokens['access']; user: User }>(
    'auth/login/',
    {
      login,
      password
    },
    { raw: true }
  )

  clearTokens()

  if (res.ok) {
    const { access, refresh } = res.data
    setTokens({ access, refresh })
  }

  return res
}

export async function signOut() {
  clearTokens()
}

export function isAuthenticated() {
  return !!getTokens()
}

export function getTokens() {
  const tokens = cookies().get('tokens')?.value
  const parsedTokens = tryParseJSON(tokens, null) as Tokens | null
  if (!parsedTokens || !parsedTokens.access || !parsedTokens.refresh) return null
  return parsedTokens
}

export function setTokens(tokens: Tokens) {
  const { access, refresh } = tokens
  cookies().set(
    'tokens',
    JSON.stringify({
      access: {
        ...access,
        expiresIn: Date.now() + access.expiresIn * 1000
      },
      refresh: {
        ...refresh,
        expiresIn: Date.now() + refresh.expiresIn * 1000
      }
    }),
    {
      maxAge: refresh.expiresIn,
      httpOnly: true,
      path: '/'
    }
  )
}

export function clearTokens() {
  cookies().delete('tokens')
}

export async function validateTokens() {
  const tokens = getTokens()
  if (!tokens) return undefined

  if (isAccessTokenExpired(tokens.access)) {
    const newTokens = await refreshToken(tokens.refresh.token)
    return newTokens
  }

  return tokens
}

export async function refreshToken(refreshToken: string) {
  const res = await api.post<Tokens>(
    'auth/refresh-token/',
    {
      refresh: refreshToken
    },
    { raw: true }
  )

  clearTokens()

  if (!res.ok) {
    console.error('Failed to refresh token', {
      status: res.data.response.status,
      statusText: res.data.response.statusText,
      data: res.data.response.data
    })
    return
  }

  const { access, refresh } = res.data

  setTokens({ access, refresh })

  return res.data
}

export function isAccessTokenExpired(access: Tokens['access']) {
  const now = Date.now()

  console.log(`\nSeconds remaining until expiration: ${Math.floor((access.expiresIn - now) / 1000)}\n`)

  return now >= access.expiresIn
}
