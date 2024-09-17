import { string } from '@/lib/zod'
import { z } from 'zod'

export const serviceSchema = z.object({
  id: z.number(),
  name: string({ name: 'Nome', min: 1 }),
  description: string({ name: 'Descrição', min: 1 }),
  category: string({ name: 'Categoria', min: 1 }),
  vehicleType: z.enum(['Car', 'Motorcycle']).default('Car'),
  durationMinutes: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const serviceCreateSchema = serviceSchema.pick({
  name: true,
  description: true,
  category: true,
  durationMinutes: true
})

export type Service = z.infer<typeof serviceSchema>
export type ServiceCreate = z.infer<typeof serviceCreateSchema>
