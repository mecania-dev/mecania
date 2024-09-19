import { MaybePromise } from '@/lib/promise'
import { User } from '@/types/entities/user'

import { AppAbility } from './casl'

export interface Tokens {
  access: string
  refresh: string
}

export interface AuthCustomProps {
  user?: User
  ability?: AppAbility
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
