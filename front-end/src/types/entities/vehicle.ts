import { stringNumeric, string } from '@/lib/zod'
import { z } from 'zod'

export const vehicleSchema = z.object({
  id: z.number(),
  brand: string({ name: 'Marca', min: 1 }),
  model: string({ name: 'Modelo', min: 1 }),
  year: stringNumeric({ name: 'Ano' }),
  kilometers: stringNumeric({ name: 'Quilometragem' }),
  plate: string({ name: 'Placa', min: 1 }),
  chassis: string({ name: 'Chassi', min: 1 }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const vehicleCreateSchema = vehicleSchema.pick({
  brand: true,
  model: true,
  year: true,
  kilometers: true,
  plate: true,
  chassis: true
})

export const vehicleUpdateSchema = vehicleCreateSchema.partial()

export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleCreate = z.infer<typeof vehicleCreateSchema>
export type VehicleUpdate = z.infer<typeof vehicleUpdateSchema>
