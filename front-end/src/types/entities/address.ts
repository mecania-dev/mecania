import { string } from '@/lib/zod'
import { z } from 'zod'

export const addressSchema = z.object({
  id: z.number(),
  userId: z.number(),
  country: string({ name: 'País', min: 1 }),
  state: string({ name: 'Estado', min: 1 }),
  city: string({ name: 'Cidade', min: 1 }),
  neighborhood: string({ name: 'Bairro', min: 1 }),
  street: string({ name: 'Rua', min: 1 }),
  number: string({ name: 'Número', min: 1 }),
  complement: string({ name: 'Complemento', min: 1, allowEmpty: true }).optional(),
  zip: string({ name: 'CEP', min: 1 }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const addressCreateSchema = addressSchema.pick({
  userId: true,
  country: true,
  state: true,
  city: true,
  street: true,
  number: true,
  complement: true,
  zip: true
})

export type Address = z.infer<typeof addressSchema>
export type AddressCreate = z.infer<typeof addressCreateSchema>
