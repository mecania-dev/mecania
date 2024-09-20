import { string } from '@/lib/zod'
import { fiscalIdentificationSchema } from '@/types/fiscal-identification'
import { phoneNumberSchema } from '@/types/phone-number'
import { z } from 'zod'

const userUpdateRawSchema = z.object({
  avatarUrl: z.instanceof(File).or(z.string()).nullable().optional(),
  username: string({ name: 'Nome de usuário', min: 1 }),
  password: string({ name: 'Senha', min: 6, max: 64 }),
  confirmPassword: string({ name: 'Confirme a Senha', min: 6, max: 64 }),
  email: z.string().email('Insira um e-mail válido'),
  firstName: string({ name: 'Nome', min: 1 }),
  lastName: string({ name: 'Sobrenome', min: 1, allowEmpty: true }),
  phoneNumber: phoneNumberSchema,
  fiscalIdentification: fiscalIdentificationSchema,
  isSuperuser: z.boolean(),
  isStaff: z.boolean(),
  isActive: z.boolean()
})

export const userUpdateSchema = userUpdateRawSchema
  .partial()
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data

    if (password !== confirmPassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: !password ? 'Preencha a senha' : 'Preencha a senha de confirmação',
          path: [!password ? 'password' : 'confirmPassword']
        })
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha de confirmação não corresponde à sua senha',
          path: ['confirmPassword']
        })
      }
    }

    return true
  })
  .transform(({ avatarUrl, ...data }) => {
    if (avatarUrl === null) return { avatarUrl, ...data }

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

    return data
  })

export const userUpdateFields = Object.keys(userUpdateRawSchema.shape)

export type UserUpdateInput = z.input<typeof userUpdateSchema>
export type UserUpdateOutput = z.output<typeof userUpdateSchema>
