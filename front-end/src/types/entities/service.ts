import { string } from '@/lib/zod'
import { z } from 'zod'

import { categorySchema } from './category'

export const serviceSchema = z.object({
  id: z.number(),
  name: string({ name: 'Nome', min: 1 }),
  description: string({ name: 'Descrição', min: 1, allowEmpty: true }).optional(),
  category: categorySchema,
  vehicleType: z.enum(['Car', 'Motorcycle']).default('Car'),
  durationMinutes: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Service = z.infer<typeof serviceSchema>
