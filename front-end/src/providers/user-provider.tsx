'use client'

import { ReactNode, createContext, useContext } from 'react'

import Loading from '@/app/loading'
import { useAuth } from '@/auth/hook'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { SignInRequest, SignUpRequest } from '@/types/auth'
import { User } from '@/types/entities/user'
import { SWRResponse } from 'swr'

export interface UserContextProps {
  user?: User
  userState: SWRResponse<User>
  isAuthenticated: boolean
  isMechanic: boolean
  signUp(props: SignUpRequest): Promise<void>
  signIn(props: SignInRequest): Promise<void>
  signOut(): Promise<void>
}

export const UserContext = createContext({} as UserContextProps)

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const { state: userState } = useSWRCustom<User>(auth.isAuthenticated ? 'users/me' : null, {
    onError: auth.isAuthenticated ? auth.signOut : undefined
  })

  const user = userState.data
  const isAuthenticated = !!user
  const isMechanic = user?.groups.includes('Mechanic') ?? false
  const isLoading = !auth.isMounted || auth.isLoading || userState.isLoading

  return (
    <UserContext.Provider
      value={{
        user,
        userState,
        isAuthenticated,
        isMechanic,
        signUp: auth.signUp,
        signIn: auth.signIn,
        signOut: auth.signOut
      }}
    >
      {isLoading ? <Loading /> : children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
