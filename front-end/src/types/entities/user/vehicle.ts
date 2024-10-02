import { string, number } from '@/lib/zod'
import { z } from 'zod'

export const vehicleSchema = z.object({
  id: z.number(),
  brand: string({ name: 'Marca', min: 1, max: 100 }),
  model: string({ name: 'Modelo', min: 1, max: 100 }),
  year: number({ name: 'Ano' }),
  mileage: number({ name: 'Quilometragem' }).nullable(),
  transmission: string({ name: 'Transmissão', min: 1, max: 100 }).nullable(),
  transmissionLabel: string({ name: 'Transmissão' }).nullable(),
  fuelType: string({ name: 'Combustível', min: 1, max: 100 }).nullable(),
  fuelTypeLabel: string({ name: 'Transmissão' }).nullable(),
  cylinderCount: number({ name: 'Cilindros' }).nullable(),
  licensePlate: string({ name: 'Placa', min: 1, max: 10 }).nullable(),
  chassisNumber: string({ name: 'Chassi', min: 1, max: 17 }).nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Vehicle = z.infer<typeof vehicleSchema>
