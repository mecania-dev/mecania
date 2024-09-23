import { User } from '@/types/entities/user'

import { api, ApiRequestConfig } from '../api'

export * from './update'

export async function getUser(id: Number, config?: ApiRequestConfig<User>) {
  return await api.get<User>(`users/${id}/`, config)
}

export async function getUsers(config?: ApiRequestConfig<User[]>) {
  return await api.get<User[]>(`users/`, config)
}
