import { api, ApiRequestConfig } from '@/http'
import { createAddress } from '@/http/address/create'
import { base64ToBlobDynamic, blobToFile } from '@/lib/file'
import { Rating } from '@/types/entities/rating'
import { User } from '@/types/entities/user'

import { MechanicCreateOutput, RateMechanicOutput } from './types'

export * from './types'

export async function createMechanic(
  { avatarUrl, rating, addresses, ...payload }: MechanicCreateOutput,
  config?: ApiRequestConfig<User>
) {
  let formData: FormData | undefined

  if (avatarUrl?.base64) {
    formData = new FormData()
    const blobAvatar = base64ToBlobDynamic(avatarUrl.base64)
    const avatar = blobToFile(blobAvatar, avatarUrl.filename)
    formData.append('avatarUrl', avatar)
    Object.entries({ ...payload, groups: ['Mechanic'] }).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          formData!.append(key, typeof v === 'string' ? v : JSON.stringify(v))
        })
      } else if (value != null) {
        formData!.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      }
    })
  }

  const mechanicRes = await api.post<User>(`users/`, formData ?? { ...payload, groups: ['Mechanic'] }, config)
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
