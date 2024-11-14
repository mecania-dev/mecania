import { string } from '@/lib/zod'
import { z } from 'zod'

export const requestCreateSchema = z.object({
  chatGroup: z.number(),
  title: string({ name: 'Título', min: 1, max: 255 }),
  mechanic: z.number(),
  messages: z
    .array(
      z.object({
        content: string({ name: 'Mensagem', min: 1, max: 4096, allowEmpty: true }),
        sender: z.number()
      })
    )
    .optional()
})

export const requestCreateFields = Object.keys(requestCreateSchema.shape)

export type RequestCreateInput = z.input<typeof requestCreateSchema>
export type RequestCreateOutput = z.output<typeof requestCreateSchema>
