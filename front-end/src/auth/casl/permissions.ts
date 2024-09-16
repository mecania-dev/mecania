import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'

type Group = User['groups'][number] | 'Admin'
type PermissionsByGroup = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Group, PermissionsByGroup> = {
  Admin(_, { can, cannot }) {
    can('manage', 'all')
    cannot('create', 'Vehicle')
  },
  Driver(user, { can }) {
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
    can(['get', 'create'], 'Vehicle')
    can(['update', 'delete'], 'Vehicle', { userId: { $eq: user.id } })
  },
  Mechanic(user, { can }) {
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
  }
}
