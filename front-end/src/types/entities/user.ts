import { string } from '@/lib/zod'
import { z } from 'zod'

import { fiscalIdentificationSchema } from '../fiscal-identification'
import { phoneNumberSchema } from '../phone-number'

export const userSchema = z.object({
  id: z.number(),
  avatarUrl: z.string().nullable().optional(),
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
  userPermissions: z.array(z.number())
})

export type User = z.infer<typeof userSchema>
