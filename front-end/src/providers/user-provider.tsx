'use client'

import { ReactNode, createContext, useContext } from 'react'

import Loading from '@/app/loading'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { useTokenRotation } from '@/hooks/use-token-rotation'
import { api } from '@/lib/api'
import { SignInRequest, SignUpRequest, TokenResponse } from '@/types/auth'
import { User } from '@/types/entities/user'
import { SWRResponse } from 'swr'

export interface UserContextProps {
  userState: SWRResponse<User>
  user?: User
  isAuthenticated: boolean
  isMechanic: boolean
  signIn(props: SignInRequest): Promise<void>
  signUp(props: SignUpRequest): Promise<void>
  logout(): Promise<void>
}

export const UserContext = createContext({} as UserContextProps)

export function UserProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens, clearTokens] = useTokenRotation()
  const { state: userState } = useSWRCustom<User>(tokens.isValid ? '/users/me' : null, {
    onError: clearTokens,
    isPaused: () => tokens.isMounted && tokens.isValidating
  })
  const user = userState.data
  const isAuthenticated = !!user
  const isMechanic = user?.groups.includes('Mechanic') ?? false

  async function signIn({ login, password }: SignInRequest) {
    const res = await api.post<TokenResponse>(
      'auth/token/',
      { login, password },
      {
        raiseToast: true,
        errorMessage: 'Login ou senha inválidos'
      }
    )
    if (res.ok) {
      setTokens(res.data)
    }
  }

  async function signUp(payload: SignUpRequest) {
    const res = await api.post<User>('auth/register/', payload, {
      raiseToast: true,
      errorMessage: error => {
        const message = Object.values(error.response?.data ?? [])[0]
        return Array.isArray(message) ? message[0] : 'Erro ao criar conta'
      }
    })
    if (res.ok) {
      await signIn({ login: payload.email, password: payload.password })
    }
  }

  async function logout() {
    clearTokens()
  }

  return (
    <UserContext.Provider value={{ userState, user, isAuthenticated, isMechanic, signIn, signUp, logout }}>
      {tokens.isMounted && !userState.isLoading ? children : <Loading />}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
