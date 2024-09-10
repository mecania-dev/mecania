import { string } from '@/lib/zod'
import { z } from 'zod'

import { User } from './user'

type MessageBase = {
  id: number
  chatId: number
  sendDate: string
}

type UserMessage = MessageBase & {
  sender: User
  message: string
}

type AIMessage = MessageBase & {
  sender: 'AI'
  message?: string
}

export type Message = UserMessage | AIMessage

export const sendMessageSchema = z.object({
  chatId: z.number().optional(),
  senderId: z.number(),
  message: string({ name: 'Mensagem', min: 1 })
})

export type SendMessage = z.infer<typeof sendMessageSchema>
