import { api, ApiRequestConfig } from '@/http'
import { Address } from '@/types/entities/address'

import { AddressUpdateOutput } from './types'

export * from './types'

export async function updateAddress(id: Number, payload: AddressUpdateOutput, config?: ApiRequestConfig<Address>) {
  return await api.patch<Address>(`addresses/${id}/`, payload, config)
}
