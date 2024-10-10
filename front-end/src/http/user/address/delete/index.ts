import { api, ApiRequestConfig } from '@/http'

export async function deleteAddress(userId: number, addressId: number, config?: ApiRequestConfig) {
  return await api.delete(`users/${userId}/addresses/${addressId}/`, config)
}
