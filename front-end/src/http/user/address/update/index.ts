import { api, ApiRequestConfig } from '@/http'
import { Address } from '@/types/entities/address'

import { AddressUpdateOutput } from './types'

export * from './types'

export async function updateAddress(
  { id, userId, ...payload }: AddressUpdateOutput,
  config?: ApiRequestConfig<Address>
) {
  return await api.patch<Address>(`users/${userId}/addresses/${id}/`, payload, config)
}
