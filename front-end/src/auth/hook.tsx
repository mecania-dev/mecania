import { useState } from 'react'

import { ACCESS_TOKEN_NAME, getValidAccessToken, setSession as setSessionAuth } from '@/auth'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { signUp as signUpRequest, SignUpRequest, signIn as signInRequest, SignInRequest } from '@/http'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'

import { setCredentialsAction, signOutAction } from './actions'

async function setSession(user?: User) {
  const access = getCookie(ACCESS_TOKEN_NAME)
  await setSessionAuth(user, access)
}

export function useAuth() {
  const { pathname, setCallbackUrl } = useRedirect()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [handleValidateAuthState, isLoading] = useIsLoading(async () => {
    const accessToken = await getValidAccessToken()
    setIsAuthenticated(!!accessToken)
  })
  const isMounted = useIsMounted(handleValidateAuthState)
  const user = useSWRCustom<User>(isAuthenticated ? 'users/me/' : null, {
    onError: signOut,
    onSuccess: setSession
  })

  async function signUp(payload: SignUpRequest, config?: Parameters<typeof signUpRequest>[1]) {
    const res = await signUpRequest(payload, config)

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

export type UseAuth = ReturnType<typeof useAuth>
