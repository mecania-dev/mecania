import { useState } from 'react'

import * as auth from '@/auth'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { useRedirect } from '@/hooks/use-redirect'
import { toast } from '@/hooks/use-toast'
import { signUp as signUpRequest, SignUpRequest, signIn as signInRequest, SignInRequest } from '@/http'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'

import { setCredentialsAction, signOutAction } from './actions'

let timeout: NodeJS.Timeout

async function rotateToken(callback?: (accessToken?: string) => void) {
  if (timeout) clearTimeout(timeout)
  const accessToken = await auth.getValidAccessToken()
  if (!accessToken) return callback?.()
  // 160 seconds before expiration, the time difference between the client and the server
  const expiresIn = auth.getTokenExpiresIn(accessToken, 1000 * 160)
  console.log('Token expires in', expiresIn / 1000, 'seconds')
  timeout = setTimeout(rotateToken, expiresIn)
  callback?.(accessToken)
}

async function setSession(user?: User) {
  const access = getCookie(auth.ACCESS_TOKEN_NAME)
  await auth.setSession(user, access)
}

export function useAuth() {
  const { pathname, setCallbackUrl } = useRedirect()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [handleValidateAuthState, isLoading] = useIsLoading(validateAuthState)
  const isMounted = useIsMounted(handleValidateAuthState)
  const user = useSWRCustom<User>(isAuthenticated ? 'users/me/' : null, { onError: signOut, onSuccess: setSession })

  async function validateAuthState() {
    await rotateToken(accessToken => {
      if (isAuthenticated !== !!accessToken) {
        setIsAuthenticated(!!accessToken)
      }
    })
  }

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
    setIsAuthenticated(true)
  }

  async function signOut() {
    if (pathname !== '/') await setCallbackUrl(pathname)
    await signOutAction(pathname !== '/')
    await user.state.mutate(undefined, false)
    setIsAuthenticated(false)
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
