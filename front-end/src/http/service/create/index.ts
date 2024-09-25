import { api, ApiRequestConfig } from '@/http'
import { Service } from '@/types/entities/service'

import { ServiceCreateOutput } from './types'

export * from './types'

export async function createService(payload: ServiceCreateOutput, config?: ApiRequestConfig<Service>) {
  return await api.post<Service>('services/', payload, config)
}
