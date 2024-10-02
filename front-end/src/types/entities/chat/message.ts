import { string } from '@/lib/zod'
import { z } from 'zod'

export const messageSchema = z.object({
  id: z.number(),
  chatGroup: z.number(),
  sender: z.object({
    id: z.number(),
    username: string({ name: 'Nome de usuário', min: 1, max: 30 }),
    isAi: z.boolean()
  }),
  content: string({ name: 'Mensagem', min: 1, max: 300 }),
  sentAt: z.string(),
  updatedAt: z.string()
})

export const sendMessageSchema = z.object({
  message: string({ name: 'Mensagem', min: 1, max: 300 })
})

export type Message = z.infer<typeof messageSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>
