import {
  ACCESS_TOKEN_NAME,
  clearSession,
  clearTokens,
  getValidAccessToken,
  REFRESH_TOKEN_NAME,
  setSession as setSessionAuth,
  setTokens
} from '@/auth'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { signUp as signUpRequest, SignUpRequest, signIn as signInRequest, SignInRequest } from '@/http'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'

function getIsAuthenticated() {
  const access = getCookie(ACCESS_TOKEN_NAME)
  const refresh = getCookie(REFRESH_TOKEN_NAME)
  return !!access && !!refresh
}

async function setSession(user?: User) {
  const access = getCookie(ACCESS_TOKEN_NAME)
  await setSessionAuth(user, access)
}

export function useAuth() {
  const { redirect, pathname, setCallbackUrl } = useRedirect()
  const [handleValidateAuthState, isLoading] = useIsLoading(getValidAccessToken)
  const isMounted = useIsMounted(handleValidateAuthState)
  const isAuthenticated = isMounted && !isLoading ? getIsAuthenticated() : false
  const user = useSWRCustom<User>(isAuthenticated ? 'users/me' : null, {
    onError: signOut,
    onSuccess: setSession
  })

  async function signUp(payload: SignUpRequest) {
    const res = await signUpRequest(payload, {
      raiseToast: true,
      errorMessage: error => {
        const message = Object.values(error.response?.data ?? [])[0]
        return Array.isArray(message) ? message[0] : 'Erro ao criar conta'
      }
    })

    if (res.ok) {
      await signIn({ login: payload.email, password: payload.password }, false)
    }
  }

  async function signIn(payload: SignInRequest, raiseToast = true) {
    const res = await signInRequest(payload)

    if (!res.ok && raiseToast) {
      toast({ message: 'Login ou senha inválidos', type: 'error' })
    }

    const { access, refresh, user } = res.data

    if (!user) {
      throw new Error('User should be returned from the server')
    }

    await setTokens(access, refresh)
    await setSession(user)
    await redirect('/profile')
  }

  async function signOut() {
    await setCallbackUrl(pathname)
    await clearSession()
    await clearTokens()

    if (pathname !== '/') {
      await redirect('/sign-in', { useCallbackUrl: false })
    }
  }

  return {
    user,
    isAuthenticated: !!user.state.data,
    isLoading: !isMounted || isLoading || user.state.isLoading,
    isMounted,
    signUp,
    signIn,
    signOut
  }
}
