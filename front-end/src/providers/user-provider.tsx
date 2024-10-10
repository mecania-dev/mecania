'use client'

import { ReactNode, createContext, useContext } from 'react'

import Loading from '@/app/loading'
import { getUserPermissions, isAuthorizedRoute } from '@/auth'
import { AbilityProvider, useAuth, UseAuth } from '@/auth/client'
import { Redirect } from '@/components/redirect'
import { User } from '@/types/entities/user'
import { getCookie } from 'cookies-next'
import { usePathname } from 'next/navigation'
import { SWRResponse } from 'swr'

export interface UserContextProps {
  user?: User
  userState: SWRResponse<User>
  isAuthenticated: boolean
  isAdmin: boolean
  isMechanic: boolean
  signUp: UseAuth['signUp']
  signIn: UseAuth['signIn']
  signOut: UseAuth['signOut']
}

export const UserContext = createContext({} as UserContextProps)

export function UserProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, signUp, signIn, signOut } = useAuth()
  const ability = getUserPermissions(user.state.data?.id, user.state.data?.groups, user.state.data?.isSuperuser)
  let redirectUrl: string | undefined

  isAuthorizedRoute(pathname, isAuthenticated, ability, {
    unauthorized: {
      onUnauthorized: () => (redirectUrl = getCookie('callback-url') ?? '/')
    },
    authorized: {
      onUnauthorized: isAuthenticated => (redirectUrl = isAuthenticated ? '/profile' : '/sign-in')
    }
  })

  return (
    <UserContext.Provider
      value={{
        user: user.state.data,
        userState: user.state,
        isAdmin: user.state.data?.isSuperuser ?? false,
        isMechanic: user.state.data?.groups.includes('Mechanic') ?? false,
        isAuthenticated,
        signUp,
        signIn,
        signOut
      }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <AbilityProvider value={ability}>{redirectUrl ? <Redirect url={redirectUrl} /> : children}</AbilityProvider>
      )}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
