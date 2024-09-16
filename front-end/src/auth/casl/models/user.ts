import { string } from '@/lib/zod'
import { fiscalIdentificationSchema } from '@/types/fiscal-identification'
import { phoneNumberSchema } from '@/types/phone-number'
import { z } from 'zod'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
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
  permissions: z.array(z.custom<Permissions>())
})

export type User = z.infer<typeof userSchema>

export type Permissions =
  | 'add_address'
  | 'change_address'
  | 'delete_address'
  | 'view_address'
  | 'add_logentry'
  | 'change_logentry'
  | 'delete_logentry'
  | 'view_logentry'
  | 'add_keepalivemessage'
  | 'change_keepalivemessage'
  | 'delete_keepalivemessage'
  | 'view_keepalivemessage'
  | 'add_group'
  | 'change_group'
  | 'delete_group'
  | 'view_group'
  | 'add_permission'
  | 'change_permission'
  | 'delete_permission'
  | 'view_permission'
  | 'add_chat'
  | 'change_chat'
  | 'delete_chat'
  | 'view_chat'
  | 'add_issue'
  | 'change_issue'
  | 'delete_issue'
  | 'view_issue'
  | 'add_message'
  | 'change_message'
  | 'delete_message'
  | 'view_message'
  | 'add_recommendation'
  | 'change_recommendation'
  | 'delete_recommendation'
  | 'view_recommendation'
  | 'add_contenttype'
  | 'change_contenttype'
  | 'delete_contenttype'
  | 'view_contenttype'
  | 'add_service'
  | 'change_service'
  | 'delete_service'
  | 'view_service'
  | 'add_session'
  | 'change_session'
  | 'delete_session'
  | 'view_session'
  | 'add_blacklistedtoken'
  | 'change_blacklistedtoken'
  | 'delete_blacklistedtoken'
  | 'view_blacklistedtoken'
  | 'add_outstandingtoken'
  | 'change_outstandingtoken'
  | 'delete_outstandingtoken'
  | 'view_outstandingtoken'
  | 'add_user'
  | 'change_user'
  | 'delete_user'
  | 'view_user'
  | 'add_vehicle'
  | 'change_vehicle'
  | 'delete_vehicle'
  | 'view_vehicle'
