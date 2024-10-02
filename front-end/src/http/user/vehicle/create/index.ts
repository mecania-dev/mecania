import { api, ApiRequestConfig } from '@/http'
import { Vehicle } from '@/types/entities/user'

import { VehicleCreateOutput } from './types'

export * from './types'

export async function createVehicle(userId: number, payload: VehicleCreateOutput, config?: ApiRequestConfig<Vehicle>) {
  return await api.post<Vehicle>(`users/${userId}/vehicles/`, payload, config)
}
