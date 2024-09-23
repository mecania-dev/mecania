import { string } from '@/lib/zod'
import { z } from 'zod'

export const addressUpdateSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  street: string({ name: 'Rua', min: 1, allowEmpty: true }).optional(),
  number: string({ name: 'Número', min: 1, allowEmpty: true }).optional(),
  district: string({ name: 'Bairro', min: 1, allowEmpty: true }).optional(),
  city: string({ name: 'Cidade', min: 1, allowEmpty: true }).optional(),
  state: string({ name: 'Estado', min: 1, allowEmpty: true }).optional(),
  zipCode: string({ name: 'CEP', min: 1, allowEmpty: true }).optional(),
  country: string({ name: 'País', min: 1, allowEmpty: true }).optional(),
  complement: string({ name: 'Complemento', min: 1, allowEmpty: true }).optional()
})

export const addressUpdateFields = Object.keys(addressUpdateSchema.shape)

export type AddressUpdateInput = z.input<typeof addressUpdateSchema>
export type AddressUpdateOutput = z.output<typeof addressUpdateSchema>
