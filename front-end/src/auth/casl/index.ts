import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { addressSubject } from './subjects/address'
import { chatSubject } from './subjects/chat'
import { serviceSubject } from './subjects/service'
import { userSubject } from './subjects/user'
import { vehicleSubject } from './subjects/vehicle'

export * from './get-user-permissions'

const appAbilitiesSchema = z.union([
  userSubject,
  addressSubject,
  vehicleSubject,
  serviceSubject,
  chatSubject,
  z.tuple([z.literal('manage'), z.literal('all')])
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  user.groups.forEach(group => {
    if (typeof permissions[group] !== 'function') {
      throw new Error(`Permissions for ${group} group not found.`)
    }

    permissions[group](user, builder)
  })

  const ability = builder.build({
    detectSubjectType: subject => subject.__typename
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
