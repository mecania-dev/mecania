import { useState } from 'react'

import {
  getValidAccessToken,
  getTokens,
  signUp as signUpRequest,
  signIn as signInRequest,
  signOut as signOutRequest
} from '@/auth'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { SignInRequest, SignUpRequest } from '@/types/auth'

export function useAuth() {
  const { redirect, pathname, router } = useRedirect()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [handleValidateAuthState, isLoading] = useIsLoading(async () => {
    const { access, refresh } = await getTokens()
    const validToken = await getValidAccessToken(access, refresh)
    setIsAuthenticated(!!validToken)
  })

  const isMounted = useIsMounted(handleValidateAuthState)

  async function signUp(payload: SignUpRequest) {
    const res = await signUpRequest(payload)
    if (res.ok) {
      await signIn({ login: payload.email, password: payload.password }, false)
    }
  }

  async function signIn(payload: SignInRequest, raiseToast = true) {
    const res = await signInRequest(payload)

    if (res.ok) {
      setIsAuthenticated(true)
      await redirect('/profile')
      router.refresh()
      return
    }

    if (raiseToast) {
      toast({ message: 'Login ou senha inválidos', type: 'error' })
    }
  }

  async function signOut() {
    await signOutRequest()
    setIsAuthenticated(false)
    await redirect('/sign-in', { callbackUrl: pathname })
    router.refresh()
  }

  return { isAuthenticated, isLoading, isMounted, signUp, signIn, signOut }
}
