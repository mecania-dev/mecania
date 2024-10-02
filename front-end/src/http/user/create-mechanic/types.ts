import { fileToBase64 } from '@/lib/file'
import { number, string } from '@/lib/zod'
import { addressSchema } from '@/types/entities/user'
import { requiredFiscalIdentificationSchema } from '@/types/fiscal-identification'
import { requiredPhoneNumberSchema } from '@/types/phone-number'
import { z } from 'zod'

const mechanicCreateRawSchema = z.object({
  avatarUrl: z
    .instanceof(File)
    .transform(async avatarUrl => {
      const base64Avatar = await fileToBase64(avatarUrl)
      return {
        base64: base64Avatar ?? undefined,
        filename: avatarUrl.name,
        mimetype: avatarUrl.type
      }
    })
    .optional(),
  username: string({ name: 'Nome de usuário', min: 1, max: 30 }),
  firstName: string({ name: 'Nome', min: 1, max: 255 }),
  email: z.string().email('Insira um e-mail válido'),
  phoneNumber: requiredPhoneNumberSchema,
  fiscalIdentification: requiredFiscalIdentificationSchema,
  rating: number({ name: 'Avaliação', min: 1, max: 5 }).int(),
  password: string({ name: 'Senha', min: 5, max: 64 }),
  confirmPassword: string({ name: 'Confirme a Senha', min: 5, max: 64 }),
  addresses: z
    .array(
      addressSchema.pick({
        street: true,
        number: true,
        district: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        complement: true
      })
    )
    .default([])
})

export const mechanicCreateSchema = mechanicCreateRawSchema
  .required({ phoneNumber: true, fiscalIdentification: true })
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
  .transform(data => {
    for (const [key, value] of Object.entries(data)) {
      if (value === '' || value == null) {
        delete data[key as keyof typeof data]
      }
    }

    return data
  })

export const rateMechanicSchema = z.object({
  mechanic: z.number(),
  score: z.number(),
  feedback: z.string().optional()
})

export const mechanicCreateFields = Object.keys(mechanicCreateRawSchema.shape)
export type MechanicCreateInput = z.input<typeof mechanicCreateSchema>
export type MechanicCreateOutput = z.output<typeof mechanicCreateSchema>

export type RateMechanicInput = z.input<typeof rateMechanicSchema>
export type RateMechanicOutput = z.output<typeof rateMechanicSchema>
