import { z } from 'zod'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.number(),
  groups: z.array(z.enum(['Mechanic', 'Driver', 'Admin']))
})

export type User = z.infer<typeof userSchema>
