import { getValidAccessToken, waitTokenRefresh } from '@/auth'
import { env } from '@/env'
import axios, { AxiosError, CreateAxiosDefaults } from 'axios'

export function getApiClient({ baseURL = env.NEXT_PUBLIC_API_BASE_URL, ...config }: CreateAxiosDefaults = {}) {
  return axios.create({ baseURL, ...config })
}

export const apiClient = getApiClient({ withCredentials: true })
export const rawApiClient = getApiClient()

apiClient.interceptors.request.use(async config => {
  await waitTokenRefresh()
  const validToken = await getValidAccessToken()

  if (validToken) {
    config.headers.Authorization = `Bearer ${validToken}`
  }

  return config
})

apiClient.interceptors.response.use(undefined, async error => {
  if (error instanceof AxiosError && error.config && [401, 403].includes(error.response?.status ?? 0)) {
    const validToken = await getValidAccessToken(true)

    if (validToken) {
      error.config.baseURL = undefined
      error.config.headers.Authorization = `Bearer ${validToken}`
      return rawApiClient.request(error.config)
    }

    return Promise.reject(error)
  }

  return Promise.reject(error)
})
