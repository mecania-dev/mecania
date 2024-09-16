import { z } from 'zod'

export const addressSchema = z.object({
  __typename: z.literal('Address').default('Address'),
  id: z.number(),
  userId: z.number()
})

export type Address = z.infer<typeof addressSchema>
