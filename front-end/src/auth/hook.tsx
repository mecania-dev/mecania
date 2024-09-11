import { useState } from 'react'

import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'

import { signIn as serverSignIn, signOut as serverSignOut, validateAuthState } from './actions'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [handleValidateAuthState, isLoading] = useIsLoading(async () => {
    const isValid = await validateAuthState()
    setIsAuthenticated(isValid)
  })

  const isMounted = useIsMounted(handleValidateAuthState)

  async function signUp(payload: SignUpRequest) {
    const res = await api.post<User>('auth/register/', payload, {
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
    const isOk = await serverSignIn(payload)

    if (!isOk && raiseToast) {
      toast({ message: 'Login ou senha inválidos', type: 'error' })
    }
  }

  async function signOut() {
    await serverSignOut()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoading, isMounted, signUp, signIn, signOut }
}
