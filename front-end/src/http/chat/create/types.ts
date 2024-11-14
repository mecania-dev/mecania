import { string } from '@/lib/zod'
import { z } from 'zod'

export const chatCreateSchema = z.object({
  vehicle: z.number(),
  members: z.array(z.number()).optional(),
  messages: z
    .array(
      z.object({
        content: string({ name: 'Mensagem', min: 1, max: 4096, allowEmpty: true }),
        sender: z.number()
      })
    )
    .optional(),
  isPrivate: z.boolean().default(true)
})

export const chatCreateFields = Object.keys(chatCreateSchema.shape)

export type ChatCreateInput = z.input<typeof chatCreateSchema>
export type ChatCreateOutput = z.output<typeof chatCreateSchema>
