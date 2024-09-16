import { z } from 'zod'

import { vehicleSchema } from '../models/vehicle'

export const vehicleSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('create'), z.literal('get'), z.literal('update'), z.literal('delete')]),
  z.union([z.literal('Vehicle'), vehicleSchema])
])

export type VehicleSubject = z.infer<typeof vehicleSubject>
