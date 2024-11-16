import { string } from '@/lib/zod'
import { z } from 'zod'

import { userSchema } from '../../user'
import { messageSchema } from '../message'

export const requestSchema = z.object({
  id: z.number(),
  groupName: string({ name: 'Grupo', min: 1 }),
  chatGroup: z.number(),
  title: string({ name: 'Título', min: 1, max: 255 }),
  driver: userSchema.pick({ id: true, username: true, isAi: true }),
  mechanic: userSchema.pick({ id: true, username: true, isAi: true }),
  accepted: z.boolean(),
  driverStatus: z.enum(['pending', 'accepted', 'rejected', 'closed']),
  mechanicStatus: z.enum(['pending', 'accepted', 'rejected', 'closed']),
  messages: messageSchema.array(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Request = z.infer<typeof requestSchema>
