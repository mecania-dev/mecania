import { string } from '@/lib/zod'
import { z } from 'zod'

import { fiscalIdentificationSchema } from '../fiscal-identification'
import { phoneNumberSchema } from '../phone-number'

export const permissions = getPermissions()
export type Permissions = (typeof permissions)[number]

export const userSchema = z.object({
  id: z.number(),
  avatarUrl: z.string().nullable(),
  username: string({ name: 'Nome de usuário', min: 1 }),
  email: z.string().email('Insira um e-mail válido'),
  firstName: string({ name: 'Nome', min: 1 }),
  lastName: string({ name: 'Sobrenome', min: 1, allowEmpty: true }),
  phoneNumber: phoneNumberSchema,
  fiscalIdentification: fiscalIdentificationSchema,
  rating: z.number().nullable().optional(),
  isSuperuser: z.boolean(),
  isStaff: z.boolean(),
  isActive: z.boolean(),
  lastLogin: z.string(),
  dateJoined: z.string(),
  updatedAt: z.string(),
  groups: z.array(z.enum(['Mechanic', 'Driver'])),
  permissions: z.array(z.enum(permissions))
})

export const userFields = Object.keys(userSchema.shape)

export type User = z.infer<typeof userSchema>

function getPermissions() {
  return [
    'add_address',
    'change_address',
    'delete_address',
    'view_address',
    'add_chat',
    'change_chat',
    'delete_chat',
    'view_chat',
    'add_issue',
    'change_issue',
    'delete_issue',
    'view_issue',
    'add_message',
    'change_message',
    'delete_message',
    'view_message',
    'add_recommendation',
    'change_recommendation',
    'delete_recommendation',
    'view_recommendation',
    'add_service',
    'change_service',
    'delete_service',
    'view_service',
    'add_user',
    'change_user',
    'delete_user',
    'view_user',
    'add_vehicle',
    'change_vehicle',
    'delete_vehicle',
    'view_vehicle'
  ] as const
}
