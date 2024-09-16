import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { userSubject } from './subjects/user'
import { permissions } from './permissions'

const appAbilitiesSchema = z.union([userSubject, z.tuple([z.literal('manage'), z.literal('all')])])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if(user.isSuperuser)

  if (typeof permissions[user.isSuperuser ? 'admin' : ] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    }
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}