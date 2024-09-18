import { ACCESS_TOKEN_NAME, getValidAccessToken, REFRESH_TOKEN_NAME, setSession as setSessionAuth } from '@/auth'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { signUp as signUpRequest, SignUpRequest, signIn as signInRequest, SignInRequest } from '@/http'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'

import { setCredentialsAction, signOutAction } from './actions'

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
  const { pathname, setCallbackUrl } = useRedirect()
  const [handleValidateAuthState, isLoading] = useIsLoading(getValidAccessToken)
  const isMounted = useIsMounted(handleValidateAuthState)
  const isAuthenticated = isMounted && !isLoading ? getIsAuthenticated() : false
  const user = useSWRCustom<User>(isAuthenticated ? 'users/me/' : null, {
    onError: signOut,
    onSuccess: setSession
  })

  async function signUp(payload: SignUpRequest) {
    const res = await signUpRequest(payload, {
      raiseToast: true,
      errorMessage: error => {
        if (error.response?.status === 500) {
          return error.response.statusText
        }

        const message = Object.values(error.response?.data ?? [])[0]
        return Array.isArray(message) ? message[0] : message || 'Erro ao criar conta'
      }
    })

    if (res.ok) {
      await signIn({ login: payload.email, password: payload.password }, false)
    }
  }

  async function signIn(payload: SignInRequest, raiseToast = true) {
    const res = await signInRequest(payload)

    if (!res.ok) {
      raiseToast && toast({ message: 'Login ou senha inválidos', type: 'error' })
      return
    }

    await setCredentialsAction(res.data)
  }

  async function signOut() {
    if (pathname !== '/') await setCallbackUrl(pathname)
    await signOutAction(pathname !== '/')
    user.state.mutate(undefined, false)
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
