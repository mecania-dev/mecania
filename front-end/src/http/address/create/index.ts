import { api, ApiRequestConfig } from '@/http'
import { Address } from '@/types/entities/address'

import { AddressCreateOutput } from './types'

export * from './types'

export async function createAddress({ userId, ...payload }: AddressCreateOutput, config?: ApiRequestConfig<Address>) {
  return await api.post<Address>(`users/${userId}/addresses/`, payload, config)
}
