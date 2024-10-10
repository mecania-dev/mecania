import { api, ApiRequestConfig } from '@/http'

export async function addServices(userId: number, services: number[], config?: ApiRequestConfig) {
  return await api.post(`users/${userId}/services/`, { services }, config)
}
