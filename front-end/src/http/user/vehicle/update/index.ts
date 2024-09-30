import { api, ApiRequestConfig } from '@/http'
import { Vehicle } from '@/types/entities/vehicle'

import { VehicleUpdateOutput } from './types'

export * from './types'

export async function updateVehicle(
  { id, userId, ...payload }: VehicleUpdateOutput,
  config?: ApiRequestConfig<Vehicle>
) {
  return await api.put<Vehicle>(`users/${userId}/vehicles/${id}/`, payload, config)
}
