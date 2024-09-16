'use client'

import { ReactNode, createContext, useContext } from 'react'

import Loading from '@/app/loading'
import { getUserPermissions } from '@/auth'
import { useAuth } from '@/auth/hook'
import { SignInRequest, SignUpRequest } from '@/http'
import { User } from '@/types/entities/user'
import { SWRResponse } from 'swr'

import { AbilityProvider } from './ability-provider'

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
  const { user, isAuthenticated, isLoading, signUp, signIn, signOut } = useAuth()
  const ability = getUserPermissions(user.state.data?.id, user.state.data?.groups, user.state.data?.isSuperuser)

  return (
    <UserContext.Provider
      value={{
        user: user.state.data,
        userState: user.state,
        isMechanic: user.state.data?.groups.includes('Mechanic') ?? false,
        isAuthenticated,
        signUp,
        signIn,
        signOut
      }}
    >
      {isLoading ? <Loading /> : <AbilityProvider value={ability}>{children}</AbilityProvider>}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
