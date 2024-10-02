import { z } from 'zod'

export const chatCreateSchema = z.object({
  vehicle: z.number(),
  isPrivate: z.boolean().default(true)
})

export const chatCreateFields = Object.keys(chatCreateSchema.shape)

export type ChatCreateInput = z.input<typeof chatCreateSchema>
export type ChatCreateOutput = z.output<typeof chatCreateSchema>
