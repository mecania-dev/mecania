import { string } from '@/lib/zod'
import { fiscalIdentificationSchema } from '@/types/fiscal-identification'
import { phoneNumberSchema } from '@/types/phone-number'
import { z } from 'zod'

import { serviceSchema } from '../service'
import { addressSchema } from './address'
import { vehicleSchema } from './vehicle'

export * from './address'
export * from './rating'
export * from './request'
export * from './vehicle'

export const permissions = getPermissions()
export type Permissions = (typeof permissions)[number]

export const userSchema = z.object({
  id: z.number(),
  username: string({ name: 'Nome de usuário', min: 1, max: 30 }),
  firstName: string({ name: 'Nome', min: 1, max: 255 }),
  lastName: string({ name: 'Sobrenome', min: 1, max: 255, allowEmpty: true }).nullable(),
  email: z.string().email('Insira um e-mail válido'),
  phoneNumber: phoneNumberSchema.nullable(),
  fiscalIdentification: fiscalIdentificationSchema.nullable(),
  avatarUrl: z.string().nullable(),
  rating: z.number().nullable().optional(),
  isSuperuser: z.boolean(),
  isStaff: z.boolean(),
  isActive: z.boolean(),
  isAi: z.boolean(),
  lastLogin: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  groups: z.array(z.enum(['Mechanic', 'Driver', 'AI'])).default([]),
  permissions: z.array(z.enum(permissions)).default([]),
  addresses: z.array(addressSchema).default([]),
  vehicles: z.array(vehicleSchema).default([]),
  services: z.array(serviceSchema).default([])
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
