import { api, ApiRequestConfig } from '@/http'

import { RequestCreateOutput } from './types'

export * from './types'

export async function createRequest(payload: RequestCreateOutput, config?: ApiRequestConfig) {
  return await api.post('chat/requests/', payload, config)
}
