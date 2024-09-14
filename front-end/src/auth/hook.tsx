import { getValidAccessToken, setSession as setSessionAuth } from '@/auth'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { signUp as signUpRequest, SignUpRequest, signIn as signInRequest, SignInRequest } from '@/http'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'

import { setCredentialsAction, signOutAction } from './actions'

function getIsAuthenticated() {
  const access = getCookie('access_token')
  const refresh = getCookie('refresh_token')
  return !!access && !!refresh
}

export function useAuth() {
  const { pathname, setCallbackUrl } = useRedirect()
  const [handleValidateAuthState, isLoading] = useIsLoading(getValidAccessToken)
  const isMounted = useIsMounted(handleValidateAuthState)
  const isAuthenticated = isMounted && !isLoading ? getIsAuthenticated() : false

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

    await setCredentialsAction(res.data)
  }

  async function signOut() {
    setCallbackUrl(pathname)
    await signOutAction()
  }

  async function setSession(user?: User) {
    await setSessionAuth(user)
  }

  return { isAuthenticated, isLoading, isMounted, signUp, signIn, signOut, setSession }
}
