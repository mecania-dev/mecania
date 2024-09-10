import { string } from '@/lib/zod'
import { z } from 'zod'

import { fiscalIdentificationSchema } from './fiscal-identification'
import { phoneNumberSchema } from './phone-number'

export interface TokenResponse {
  access: {
    token: string
    expires: string
    issuedAt: string
    expiresIn: number
  }
  refresh: {
    token: string
    expires: string
    issuedAt: string
    expiresIn: number
  }
}

export const signInSchema = z.object({
  login: string({ name: 'Email ou nome de usuário', min: 1 }),
  password: string({ name: 'Senha', min: 6, max: 64 }, { required_error: 'Por favor, insira uma senha' })
})

export const signUpSchema = z
  .object({
    username: string({ name: 'Nome de usuário', min: 1 }),
    email: z.string().email('Insira um e-mail válido'),
    firstName: string({ name: 'Nome', min: 1 }),
    lastName: string({ name: 'Sobrenome', min: 1, allowEmpty: true }).optional(),
    phoneNumber: phoneNumberSchema,
    fiscalIdentification: fiscalIdentificationSchema,
    password: string({ name: 'Senha', min: 6, max: 64 }, { required_error: 'Por favor, insira uma senha' }),
    confirmPassword: string({ name: 'Confirme a Senha', min: 6, max: 64 }, { required_error: 'Confirme sua senha' }),
    groups: z.array(z.enum(['Mechanic', 'Driver']))
  })
  .superRefine((data, ctx) => {
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
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha de confirmação não corresponde à sua senha',
        path: ['password', 'confirmPassword']
      })
    }

    return true
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Insira um e-mail válido')
})

export const newPasswordSchema = z
  .object({
    newPassword: string({ name: 'Nova Senha', min: 6, max: 64 }, { required_error: 'Insira sua nova senha' }),
    confirmPassword: string(
      { name: 'Confirme a Nova Senha', min: 6, max: 64 },
      { required_error: 'Confirme sua nova senha' }
    )
  })
  .superRefine((data, ctx) => {
    const { newPassword, confirmPassword } = data

    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha de confirmação não corresponde à sua senha',
        path: ['newPassword', 'confirmPassword']
      })
    }

    return true
  })

export type SignInRequest = z.input<typeof signInSchema>
export type SignUpRequest = z.input<typeof signUpSchema>
export type ForgotPasswordRequest = z.input<typeof forgotPasswordSchema>
export type NewPasswordRequest = z.input<typeof newPasswordSchema>
