import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'

type Group = User['groups'][number] | 'Admin'
type PermissionsByGroup = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Group, PermissionsByGroup> = {
  Admin(_, { can, cannot }) {
    can('manage', 'all')
    cannot('manage', 'Vehicle')
    cannot('manage', 'Address')
    cannot('manage', 'Chat')
  },
  Driver(user, { can, cannot }) {
    // User
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
    // Vehicle
    can(['get', 'create'], 'Vehicle')
    can(['update', 'delete'], 'Vehicle', { userId: { $eq: user.id } })
    // Service
    can('get', 'Service')
    // Chat
    can('manage', 'Chat')
    cannot('message_user', 'Chat')
  },
  Mechanic(user, { can, cannot }) {
    // User
    can('get', 'User')
    can(['update', 'delete'], 'User', { id: { $eq: user.id } })
    // Address
    can(['get', 'create'], 'Address')
    can(['update', 'delete'], 'Address', { userId: { $eq: user.id } })
    // Service
    can(['get', 'provide'], 'Service')
    // Chat
    can('manage', 'Chat')
    cannot('ask_ai', 'Chat')
    cannot('message_mechanic', 'Chat')
  },
  AI({}, {}) {
    //
  }
}
