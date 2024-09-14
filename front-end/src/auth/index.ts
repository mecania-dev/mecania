import { api } from '@/lib/api'
import { cookies } from '@/lib/cookies'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { redirect } from 'next/navigation'

export interface Tokens {
  access: string
  refresh: string
}

interface AuthCustomProps {
  user?: User
  isAuthenticated: boolean
  setRedirectUrl: (url?: string) => void
}

interface AuthProps {
  groups?: User['groups']
  unauthorizedGroups?: User['groups']
  redirectUrl?: string
  custom?: MaybePromise<(props: AuthCustomProps) => boolean | undefined | void>
}

export async function auth({ groups, unauthorizedGroups, redirectUrl, custom }: AuthProps = {}) {
  const session = await getSession()
  const isAuthenticated = !!session
  let authorized = false // I'm not initializing this with isAuthenticated because of the groups verification
  let user: User | undefined
  let realRedirectUrl: string | undefined = redirectUrl ?? '/sign-in'

  if (session) {
    user = session

    if (groups?.length) {
      for (const group of groups) {
        if (user.groups.includes(group)) {
          authorized = true
          break
        }
      }
    } else if (unauthorizedGroups?.length) {
      for (const group of unauthorizedGroups) {
        if (user.groups.includes(group)) {
          authorized = false
          break
        }
      }
    } else {
      authorized = true
    }
  }

  function setRedirectUrl(url?: string) {
    realRedirectUrl = url
  }

  const customRes = await maybePromise(custom, { user, isAuthenticated, setRedirectUrl })

  if (customRes != null) {
    authorized = customRes
  }

  if (!authorized && realRedirectUrl) redirect(realRedirectUrl)
  return authorized
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
    const { access, refresh, user } = res.data
    await setTokens(access, refresh)
    await setSession(user)
  } else {
    await setTokens()
  }

  return res
}

export async function signOut() {
  const isAuthed = await isAuthenticated()
  if (!isAuthed) return

  const res = await api.post('auth/logout/', {})
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
    await setSession()
  }
}

export async function getSession() {
  const sessionJson = await cookies('session')
  if (sessionJson) {
    try {
      return JSON.parse(sessionJson) as User
    } catch {}
  }
}

export async function setSession(user?: User) {
  if (user) {
    await cookies.set({ session: user })
  } else {
    await cookies.delete('session')
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
