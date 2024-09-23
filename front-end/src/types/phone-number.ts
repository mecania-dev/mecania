import { isValidPhoneNumber } from '@/lib/masks/phone-number'
import { string } from '@/lib/zod'

export const phoneNumberSchema = string({ name: 'Telefone', min: 1, allowEmpty: true })
  .optional()
  .refine(value => !value || isValidPhoneNumber(value), 'Insira um número de telefone válido')

export const requiredPhoneNumberSchema = string({ name: 'Telefone', min: 1 }).refine(
  value => !value || isValidPhoneNumber(value),
  'Insira um número de telefone válido'
)
