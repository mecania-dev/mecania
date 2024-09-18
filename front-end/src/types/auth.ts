import { string } from '@/lib/zod'
import { z } from 'zod'

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
      if (!newPassword || !confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: !newPassword ? 'Preencha a nova senha' : 'Preencha a senha de confirmação',
          path: [!newPassword ? 'newPassword' : 'confirmPassword']
        })
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A senha de confirmação não corresponde à nova senha',
          path: ['confirmPassword']
        })
      }
    }

    return true
  })

export type ForgotPasswordRequest = z.input<typeof forgotPasswordSchema>
export type NewPasswordRequest = z.input<typeof newPasswordSchema>
