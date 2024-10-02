import { api, ApiRequestConfig } from '@/http'
import { Category } from '@/types/entities/service'

import { CategoryCreateOutput } from './types'

export * from './types'

export async function createCategory(payload: CategoryCreateOutput, config?: ApiRequestConfig<Category>) {
  return await api.post<Category>('services/categories/', payload, config)
}
