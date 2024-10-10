import { api, ApiRequestConfig } from '@/http'

export async function deleteService(userId: number, serviceId: number, config?: ApiRequestConfig) {
  return await api.delete(`users/${userId}/services/${serviceId}/`, config)
}
