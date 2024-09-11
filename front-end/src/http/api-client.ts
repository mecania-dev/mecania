import { env } from '@/env'
import axios from 'axios'

import { getAccessToken } from './get-access-token'

export function getApiClient() {
  return axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL })
}

export const apiClient = getApiClient()
export const rawApiClient = getApiClient()

apiClient.interceptors.request.use(async config => {
  const accessToken = await getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
