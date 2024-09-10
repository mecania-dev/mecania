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

export const userUpdateSchema = userSchema
  .pick({
    username: true,
    email: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    fiscalIdentification: true,
    isSuperuser: true,
    isStaff: true,
    isActive: true
  })
  .extend({
    avatarUrl: z.instanceof(File).or(z.string()).nullable().optional(),
    password: string({ name: 'Senha', min: 6, max: 64 }),
    confirmPassword: string({ name: 'Confirme a Senha', min: 6, max: 64 })
  })
  .partial()
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data

    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha de confirmação não corresponde à sua senha',
        path: ['password', 'confirmPassword']
      })
    }

    return true
  })
  .transform(({ avatarUrl, ...data }) => {
    if (avatarUrl instanceof File) {
      const formData = new FormData()
      formData.append('avatarUrl', avatarUrl)
      Object.entries(data).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, typeof value === 'string' ? value : String(value))
        }
      })
      return formData
    }
    return { avatarUrl, ...data }
  })

export type User = z.infer<typeof userSchema>
export type UserUpdateInput = z.input<typeof userUpdateSchema>
export type UserUpdateOutput = z.output<typeof userUpdateSchema>
