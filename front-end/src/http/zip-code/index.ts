import { api, ApiRequestConfig } from '@/http'

import { ZipCodeResponse } from './types'

export * from './types'

export function getZipCodeUrl(zipCode: string) {
  return `https://brasilapi.com.br/api/cep/v2/${zipCode}`
}

export async function getZipCode(zipCode: string, config?: Omit<ApiRequestConfig<ZipCodeResponse>, 'raw'>) {
  return await api.get<ZipCodeResponse>(getZipCodeUrl(zipCode), { raw: true, ...config })
}
