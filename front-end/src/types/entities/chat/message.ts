import { string } from '@/lib/zod'
import { z } from 'zod'

import { userSchema } from '../user'

export const messageSchema = z.object({
  id: z.number(),
  sender: userSchema.pick({ id: true, username: true, isAi: true }),
  content: string({ name: 'Mensagem', min: 1, max: 4096 }),
  sentAt: z.string(),
  updatedAt: z.string()
})

export const sendMessageSchema = z.object({
  message: string({ name: 'Mensagem', min: 1, max: 4096 })
})

export type Message = z.infer<typeof messageSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>
