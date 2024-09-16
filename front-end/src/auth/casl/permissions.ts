import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'

type Group = User['groups'][number] | 'admin'
type PermissionsByGroup = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Group, PermissionsByGroup> = {
  admin(_, { can }) {
    can('manage', 'all')
  },
  Driver(user, { can }) {
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
  },
  Mechanic(user, { can }) {
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
  }
}
