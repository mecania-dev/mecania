import { z } from 'zod'

import { addressSchema } from './address'
import { serviceSchema } from './service'
import { userSchema } from './user'

export const mechanicSchema = userSchema.extend({
  addresses: addressSchema.array(),
  services: serviceSchema.array()
})

export type Mechanic = z.infer<typeof mechanicSchema>
