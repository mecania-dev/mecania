import { api, ApiRequestConfig } from '@/http'

import { CNPJApiResponse } from './types'

export * from './types'

export function getCNPJUrl(CNPJ: string) {
  return `https://brasilapi.com.br/api/cnpj/v1/${CNPJ.replace(/\D/g, '')}`
}

export async function getCNPJ(CNPJ: string, config?: Omit<ApiRequestConfig<CNPJApiResponse>, 'raw'>) {
  return await api.get<CNPJApiResponse>(getCNPJUrl(CNPJ), { raw: true, ...config })
}
