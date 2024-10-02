import { string } from '@/lib/zod'
import { z } from 'zod'

export const categorySchema = z.object({
  id: z.number(),
  name: string({ name: 'Nome', min: 1, max: 255 }),
  description: string({ name: 'Descrição', min: 1, max: 255, allowEmpty: true }).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Category = z.infer<typeof categorySchema>
