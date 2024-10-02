import { string } from '@/lib/zod'
import { z } from 'zod'

import { recommendationSchema } from './recommendation'

export const issueSchema = z.object({
  id: z.number(),
  description: string({ name: 'Descrição', min: 1 }),
  category: string({ name: 'Categoria', min: 1, max: 50 }),
  status: z.enum(['open', 'resolved']),
  solution: string({ name: 'Solução', min: 1, allowEmpty: true }).nullable(),
  isResolved: z.boolean(),
  recommendations: recommendationSchema.array(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Issue = z.infer<typeof issueSchema>
