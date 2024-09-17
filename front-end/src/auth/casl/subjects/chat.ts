import { z } from 'zod'

export const chatSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('ask_ai'),
    z.literal('message_mechanic'),
    z.literal('message_user')
  ]),
  z.literal('Chat')
])

export type ChatSubject = z.infer<typeof chatSubject>
