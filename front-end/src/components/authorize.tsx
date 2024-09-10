'use client'
import { ReactNode } from 'react'

import { isArray } from '@/lib/assertions'
import { useUser } from '@/providers/user-provider'
import { User } from '@/types/entities/user'
import { usePathname } from 'next/navigation'

import { Redirect } from './redirect'

export interface AuthorizeCustomProps {
  isAuthenticated: boolean
  user?: User | null
  pathname: string
}

export interface AuthorizeProps {
  children: ReactNode
  groups?: User['groups']
  unauthorizedGroups?: User['groups']
  custom?: (props: AuthorizeCustomProps) => boolean | [boolean, string] | undefined
  redirect?: string
  fallback?: ReactNode
}

export function Authorize({
  children,
  groups,
  unauthorizedGroups,
  custom,
  redirect = '/sign-in',
  fallback
}: AuthorizeProps) {
  const { isAuthenticated, user } = useUser()
  const pathname = usePathname()
  let authorized = isAuthenticated

  const customResponse = custom?.({ isAuthenticated, user, pathname })

  if (user && customResponse == null) {
    authorized =
      (!groups || groups.some(g => user.groups.includes(g))) && !unauthorizedGroups?.some(g => user.groups.includes(g))
  }

  if (customResponse != null) {
    authorized = isArray(customResponse) ? customResponse[0] : customResponse
    redirect = isArray(customResponse) ? customResponse[1] : redirect
  }

  if (!authorized && !fallback) {
    return <Redirect url={redirect} />
  }

  return authorized ? children : fallback
}
