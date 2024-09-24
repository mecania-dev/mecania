import { string } from '@/lib/zod'
import { User } from '@/types/entities/user'
import { fiscalIdentificationSchema } from '@/types/fiscal-identification'
import { phoneNumberSchema } from '@/types/phone-number'
import { z } from 'zod'

export type SignUpResponse = User

const signUpRawSchema = z.object({
  username: string({ name: 'Nome de usuário', min: 1, max: 30 }),
  email: z.string().email('Insira um e-mail válido'),
  firstName: string({ name: 'Nome', min: 1, max: 255 }),
  lastName: string({ name: 'Sobrenome', min: 1, max: 255, allowEmpty: true }).optional(),
  phoneNumber: phoneNumberSchema,
  fiscalIdentification: fiscalIdentificationSchema,
  password: string({ name: 'Senha', min: 5, max: 64 }, { required_error: 'Por favor, insira uma senha' }),
  confirmPassword: string({ name: 'Confirme a Senha', min: 5, max: 64 }, { required_error: 'Confirme sua senha' }),
  groups: z.array(z.enum(['Mechanic', 'Driver']))
})

export const signUpSchema = signUpRawSchema.superRefine((data, ctx) => {
  const { password, confirmPassword, groups } = data

  if (groups?.includes('Mechanic')) {
    if (!data.fiscalIdentification) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de identificação é obrigatório para mecânicos',
        path: ['fiscalIdentification']
      })
    }
    if (!data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de telefone é obrigatório para mecânicos',
        path: ['phoneNumber']
      })
    }
  }

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

export const signUpFields = Object.keys(signUpRawSchema.shape)

export type SignUpRequest = z.input<typeof signUpSchema>
