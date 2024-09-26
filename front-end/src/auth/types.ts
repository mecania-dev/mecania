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
}

export interface AuthProps {
  admin?: boolean
  groups?: User['groups']
  unauthorizedGroups?: User['groups']
  custom?: MaybePromise<(props: AuthCustomProps) => boolean | undefined | void>
}
