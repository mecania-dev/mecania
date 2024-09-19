'use client'

import { ReactNode, createContext, useContext } from 'react'

import Loading from '@/app/loading'
import { getUserPermissions } from '@/auth'
import { AbilityProvider, useAuth, UseAuth } from '@/auth/client'
import { User } from '@/types/entities/user'
import { SWRResponse } from 'swr'

export interface UserContextProps {
  user?: User
  userState: SWRResponse<User>
  isAuthenticated: boolean
  isMechanic: boolean
  signUp: UseAuth['signUp']
  signIn: UseAuth['signIn']
  signOut: UseAuth['signOut']
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
