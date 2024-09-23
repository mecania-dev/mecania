import { api, ApiRequestConfig } from '@/http'
import { Rating } from '@/types/entities/rating'
import { User } from '@/types/entities/user'

import { MechanicCreateOutput, RateMechanicOutput } from './types'

export * from './types'

export async function createMechanic({ rating, ...payload }: MechanicCreateOutput, config?: ApiRequestConfig<User>) {
  const mechanicRes = await api.post<User>(`users/`, { ...payload, groups: ['Mechanic'] }, config)
  if (mechanicRes.ok && rating) {
    await rateMechanic({ mechanic: mechanicRes.data.id, score: rating })
  }
  return mechanicRes
}

export async function rateMechanic(payload: RateMechanicOutput, config?: ApiRequestConfig<Rating>) {
  return await api.post<Rating>(`ratings/`, payload, config)
}
