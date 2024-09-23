import { string } from '@/lib/zod'
import { z } from 'zod'

export const addressCreateSchema = z.object({
  userId: z.number(),
  zipCode: string({ name: 'CEP', min: 1 }),
  country: string({ name: 'País', min: 1 }),
  state: string({ name: 'Estado', min: 1 }),
  city: string({ name: 'Cidade', min: 1 }),
  district: string({ name: 'Bairro', min: 1 }),
  street: string({ name: 'Rua', min: 1 }),
  number: string({ name: 'Número', min: 1 }),
  complement: string({ name: 'Complemento', min: 1, allowEmpty: true }).optional()
})

export const addressCreateFields = Object.keys(addressCreateSchema.shape)

export type AddressCreateInput = z.input<typeof addressCreateSchema>
export type AddressCreateOutput = z.output<typeof addressCreateSchema>
