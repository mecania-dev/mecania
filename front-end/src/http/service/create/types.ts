import { string } from '@/lib/zod'
import { z } from 'zod'

export const serviceCreateSchema = z.object({
  name: string({ name: 'Nome', min: 1 }),
  description: string({ name: 'Descrição', min: 1, allowEmpty: true }).optional(),
  category: string({ name: 'Categoria', min: 1 }),
  vehicleType: z.enum(['Car', 'Motorcycle']).default('Car'),
  durationMinutes: z.number().nullable().optional()
})

export const serviceCreateFields = Object.keys(serviceCreateSchema.shape)

export type ServiceCreateInput = z.input<typeof serviceCreateSchema>
export type ServiceCreateOutput = z.output<typeof serviceCreateSchema>
