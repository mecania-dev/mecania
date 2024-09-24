import { api, ApiRequestConfig } from '@/http'
import { createAddress } from '@/http/address/create'
import { Rating } from '@/types/entities/rating'
import { User } from '@/types/entities/user'

import { MechanicCreateOutput, RateMechanicOutput } from './types'

export * from './types'

export async function createMechanic(
  { rating, addresses, ...payload }: MechanicCreateOutput,
  config?: ApiRequestConfig<User>
) {
  const mechanicRes = await api.post<User>(`users/`, { ...payload, groups: ['Mechanic'] }, config)
  if (mechanicRes.ok && rating) {
    await rateMechanic({ mechanic: mechanicRes.data.id, score: rating })
  }
  if (mechanicRes.ok && addresses) {
    for (const address of addresses) {
      await createAddress({ userId: mechanicRes.data.id, ...address })
    }
  }
  return mechanicRes
}

export async function rateMechanic(payload: RateMechanicOutput, config?: ApiRequestConfig<Rating>) {
  return await api.post<Rating>(`ratings/`, payload, config)
}
