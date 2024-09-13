import { getTokens, isTokensValid } from '@/auth'
import { env } from '@/env'
import axios from 'axios'

export function getApiClient() {
  return axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL, withCredentials: true })
}

export const apiClient = getApiClient()
export const rawApiClient = getApiClient()

apiClient.interceptors.request.use(async config => {
  const { access, refresh } = await getTokens()
  await isTokensValid(access, refresh)

  return config
})
