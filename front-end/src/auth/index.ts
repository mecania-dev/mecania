import { api } from '@/lib/api'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'
import { getCookies, setCookie, deleteCookie } from 'cookies-next'
import { CookiesFn } from 'cookies-next/lib/types'
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
  const res = await api.post('auth/logout/', {}, { raw: true })
  await setTokens()
  return res
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

  const { access_token, refresh_token } = getCookies({ cookies: cookieStore })

  return { access: access_token, refresh: refresh_token }
}

export async function setTokens(access?: string, refresh?: string) {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')

    cookieStore = serverCookies
  }

  if (access && refresh) {
    setCookie('access_token', access, { cookies: cookieStore })
    setCookie('refresh_token', refresh, { cookies: cookieStore })
  } else {
    deleteCookie('access_token', { cookies: cookieStore })
    deleteCookie('refresh_token', { cookies: cookieStore })
  }
}

export async function isTokensValid(
  accessToken?: string,
  refreshToken?: string,
  onSuccess?: (access: string, refresh?: string) => void
) {
  if (!accessToken) return false
  let decoded: JwtPayload

  console.log('Iniciando validação de tokens...')
  console.log(`\naccessToken: ${accessToken}`)
  console.log(`\nrefreshToken: ${refreshToken}`)

  try {
    decoded = jwtDecode(accessToken)
    console.log('\nDecodificado com sucesso!')
  } catch {
    await setTokens()
    console.log('\nErro ao decodificar token!')
    return false
  }

  const now = Date.now()
  const expiration = (decoded.exp ?? now) * 1000
  const isExpired = now >= expiration

  console.log(`\nFaltam ${(expiration - now) / 1000} segundos para expirar o token.`)

  if (!isExpired) {
    console.log('\nToken válido!')
    onSuccess?.(accessToken, refreshToken)
    return true
  }
  if (!refreshToken) {
    console.log('\nToken expirado e sem refreshToken!')
    return false
  }

  const res = await api.post<{ access: string; refresh: string }>(
    '/auth/refresh/',
    { refresh: refreshToken },
    { raw: true }
  )

  if (!res.ok) {
    console.log('\nErro ao atualizar token!')
    await setTokens()
    return false
  }

  const { access, refresh } = res.data
  await setTokens(access, refresh)
  onSuccess?.(access, refresh)
  console.log('\nToken atualizado com sucesso!')
  console.log(`\naccessToken: ${access}`)
  console.log(`\nrefreshToken: ${refresh}`)
  console.log('-----------------------------------\n')
  return true
}
