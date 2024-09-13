import { api } from '@/lib/api'
import { cookies } from '@/lib/cookies'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'
import { jwtDecode, JwtPayload } from 'jwt-decode'

export interface Tokens {
  access: string
  refresh: string
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
  const res = await api.post<{ access: string; refresh: string; user: User }>(
    'auth/login/',
    {
      login,
      password
    },
    { raw: true }
  )

  if (res.ok) {
    const { access, refresh } = res.data
    await setTokens(access, refresh)
  } else {
    await setTokens()
  }

  return res
}

export async function signOut() {
  if (!(await isAuthenticated())) return

  const res = await api.post('auth/logout/', {}, { raw: true })
  await setTokens()
  return res
}

export async function isAuthenticated() {
  const { access, refresh } = await getTokens()
  return !!access && !!refresh
}

export async function getTokens() {
  return await cookies({ access: 'access_token', refresh: 'refresh_token' })
}

export async function setTokens(access?: string, refresh?: string) {
  if (access && refresh) {
    await cookies.set({ access_token: access, refresh_token: refresh })
  } else {
    await cookies.delete(['access_token', 'refresh_token'])
  }
}

export async function getValidAccessToken(accessToken?: string, refreshToken?: string) {
  if (!accessToken && !refreshToken) return
  let decoded: JwtPayload | undefined

  if (accessToken) {
    try {
      decoded = jwtDecode(accessToken)
    } catch {
      await setTokens()
      return
    }

    const now = Date.now()
    const expiration = (decoded?.exp ?? now) * 1000
    const isExpired = now >= expiration

    if (!isExpired) return accessToken
  }

  if (!refreshToken) return

  const res = await api.post<{ access: string; refresh: string }>(
    '/auth/refresh/',
    { refresh: refreshToken },
    { raw: true }
  )

  if (!res.ok) {
    await setTokens()
    return
  }

  const { access, refresh } = res.data
  await setTokens(access, refresh)
  return access
}
