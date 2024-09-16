import { z } from 'zod'

import { addressSchema } from '../models/address'

export const addressSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('create'), z.literal('get'), z.literal('update'), z.literal('delete')]),
  z.union([z.literal('Address'), addressSchema])
])

export type AddressSubject = z.infer<typeof addressSubject>
