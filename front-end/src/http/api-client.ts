import { getTokens, getValidAccessToken } from '@/auth'
import { env } from '@/env'
import axios, { AxiosError } from 'axios'

export function getApiClient() {
  return axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL, withCredentials: true })
}

export const apiClient = getApiClient()
export const rawApiClient = getApiClient()

apiClient.interceptors.request.use(async config => {
  const { access, refresh } = await getTokens()

  const validToken = await getValidAccessToken(access, refresh)

  if (validToken) {
    config.headers.Authorization = `Bearer ${validToken}`
  }

  return config
})

apiClient.interceptors.response.use(undefined, async error => {
  if (error instanceof AxiosError && error.config && [401, 403].includes(error.response?.status ?? 0)) {
    const { refresh } = await getTokens()

    const validToken = await getValidAccessToken(undefined, refresh)

    if (validToken) {
      error.config.baseURL = undefined
      error.config.headers.Authorization = `Bearer ${validToken}`
      return rawApiClient.request(error.config)
    }

    return Promise.reject(error)
  }

  return Promise.reject(error)
})
