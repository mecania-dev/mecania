import { z } from 'zod'

export const vehicleSchema = z.object({
  __typename: z.literal('Vehicle').default('Vehicle'),
  id: z.number(),
  userId: z.number()
})

export type Vehicle = z.infer<typeof vehicleSchema>
