import { z } from 'zod'

export const ratingSchema = z.object({
  id: z.number(),
  score: z.number(),
  feedback: z.string().optional(),
  createdAt: z.string(),
  driver: z.number(),
  mechanic: z.number()
})

export type Rating = z.infer<typeof ratingSchema>
