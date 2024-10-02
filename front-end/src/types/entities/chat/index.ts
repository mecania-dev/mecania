import { string } from '@/lib/zod'
import { z } from 'zod'

import { userSchema } from '../user'
import { issueSchema } from './issue'
import { messageSchema } from './message'

export * from './issue'
export * from './message'
export * from './recommendation'

export const chatSchema = z.object({
  id: z.number(),
  groupName: string({ name: 'Grupo', min: 1 }),
  title: string({ name: 'Título', min: 1, max: 255 }),
  members: userSchema.pick({ id: true, username: true, isAi: true }).array(),
  vehicle: z.number(),
  messages: messageSchema.array(),
  issues: issueSchema.array(),
  isPrivate: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Chat = z.infer<typeof chatSchema>
