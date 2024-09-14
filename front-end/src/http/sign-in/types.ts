import { string } from '@/lib/zod'
import { User } from '@/types/entities/user'
import { z } from 'zod'

export interface SignInResponse {
  access: string
  refresh: string
  user: User
}

export const signInSchema = z.object({
  login: string({ name: 'Email ou nome de usuário', min: 1 }),
  password: string({ name: 'Senha', min: 6, max: 64 }, { required_error: 'Por favor, insira uma senha' })
})

export type SignInRequest = z.input<typeof signInSchema>
