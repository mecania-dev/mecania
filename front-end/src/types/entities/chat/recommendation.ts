import { z } from 'zod'

export const recommendationSchema = z.object({
  id: z.number(),
  service: z.number(),
  aiSuggested: z.boolean(),
  createdAt: z.string()
})

export type Recommendation = z.infer<typeof recommendationSchema>
