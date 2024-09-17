import { defineAbilityFor } from './casl'
import { User } from './casl/models/user'

export function getUserPermissions(userId: number = 0, groups: User['groups'] = [], isSuperuser = false) {
  if (isSuperuser && !groups.includes('Admin')) groups.push('Admin')

  const ability = defineAbilityFor({ __typename: 'User', id: userId, groups })

  return ability
}
