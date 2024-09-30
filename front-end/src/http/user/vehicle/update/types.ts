import { number, string } from '@/lib/zod'
import { z } from 'zod'

export const vehicleUpdateSchema = z.object({
  id: z.number(),
  userId: z.number(),
  brand: string({ name: 'Marca', min: 1, max: 100 }),
  model: string({ name: 'Modelo', min: 1, max: 100 }),
  year: number({ name: 'Ano' }),
  mileage: number({ name: 'Quilometragem' }).nullable().optional(),
  transmission: string({ name: 'Transmissão', min: 1, max: 100, allowEmpty: true }).nullable().optional(),
  fuelType: string({ name: 'Combustível', min: 1, max: 100, allowEmpty: true }).nullable().optional(),
  cylinderCount: number({ name: 'Cilindros' }).nullable().optional(),
  licensePlate: string({ name: 'Placa', min: 1, max: 10, allowEmpty: true }).nullable().optional(),
  chassisNumber: string({ name: 'Chassi', min: 1, max: 17, allowEmpty: true }).nullable().optional()
})

export const vehicleUpdateFields = Object.keys(vehicleUpdateSchema.shape)

export type VehicleUpdateInput = z.input<typeof vehicleUpdateSchema>
export type VehicleUpdateOutput = z.output<typeof vehicleUpdateSchema>
