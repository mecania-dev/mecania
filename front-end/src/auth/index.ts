import { api } from '@/lib/api'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'
import { getCookies } from 'cookies-next'
import { CookiesFn } from 'cookies-next/lib/types'
import { jwtDecode } from 'jwt-decode'

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

export async function signUp(payload: SignUpRequest) {
  const res = await api.post<User>('users/', payload, {
    raiseToast: true,
    errorMessage: error => {
      const message = Object.values(error.response?.data ?? [])[0]
      return Array.isArray(message) ? message[0] : 'Erro ao criar conta'
    }
  })

  return res
}

export async function signIn({ login, password }: SignInRequest) {
  const res = await api.post<{ refresh: Tokens['refresh']; access: Tokens['access']; user: User }>(
    'auth/login/',
    {
      login,
      password
    },
    { raw: true }
  )

  return res
}

export async function signOut() {
  await api.post('auth/logout/', {}, { raw: true })
}

export async function isAuthenticated() {
  const { access, refresh } = await getTokens()
  return !!access && !!refresh
}

export async function getTokens() {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')

    cookieStore = serverCookies
  }

  const { access, refresh } = getCookies({ cookies: cookieStore })

  return { access, refresh }
}

export async function isTokensValid(token?: string, refresh?: string) {
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    const now = Date.now()
    const expiration = (decoded?.exp ?? now) * 1000
    const isExpired = now >= expiration

    console.log(`\nSeconds remaining until expiration: ${Math.floor((expiration - now) / 1000)}\n`)

    if (!isExpired) return true
    if (!refresh) return false

    console.log('Token expired, refreshing...')
    try {
      const res = await api.post('/auth/refresh/', {}, { raw: true })
      console.log('Token refreshed')
      console.log(res.data)
      return true
    } catch (error) {
      console.log('Failed to refresh token')
      console.error(error)
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
