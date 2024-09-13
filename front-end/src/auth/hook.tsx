import { useState } from 'react'

import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { toast } from '@/hooks/use-toast'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { useRouter } from 'next/navigation'

import {
  getTokens,
  isTokensValid,
  signUp as signUpRequest,
  signIn as signInRequest,
  signOut as signOutRequest
} from '.'

export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [handleValidateAuthState, isLoading] = useIsLoading(async () => {
    const { access, refresh } = await getTokens()
    const isValid = await isTokensValid(access, refresh)
    setIsAuthenticated(isValid)
  })

  const isMounted = useIsMounted(handleValidateAuthState)

  async function signUp(payload: SignUpRequest) {
    const res = await signUpRequest(payload)
    if (res.ok) {
      await signIn({ login: payload.email, password: payload.password }, false)
      router.refresh()
    }
  }

  async function signIn(payload: SignInRequest, raiseToast = true) {
    const res = await signInRequest(payload)

    if (res.ok) {
      setIsAuthenticated(true)
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
    router.refresh()
  }

  return { isAuthenticated, isLoading, isMounted, signUp, signIn, signOut }
}
