import { api, ApiRequestConfig } from '@/http'
import { User } from '@/types/entities/user'

import { UserUpdateOutput } from './types'

export * from './types'

export async function updateUser(id: Number, payload: UserUpdateOutput, config?: ApiRequestConfig<User>) {
  return await api.patch<User>(`users/${id}/`, payload, config)
}
