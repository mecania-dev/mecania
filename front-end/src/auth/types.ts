import { MaybePromise } from '@/lib/promise'
import { User } from '@/types/entities/user'

export interface Tokens {
  access: string
  refresh: string
}

export interface AuthCustomProps {
  user?: User
  isAuthenticated: boolean
  setRedirectUrl: (url?: string) => void
}

export interface AuthProps {
  admin?: boolean
  groups?: User['groups']
  unauthorizedGroups?: User['groups']
  redirectUrl?: string
  custom?: MaybePromise<(props: AuthCustomProps) => boolean | undefined | void>
}
