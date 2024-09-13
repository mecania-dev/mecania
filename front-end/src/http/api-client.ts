import { getTokens, isTokensValid } from '@/auth'
import { env } from '@/env'
import axios, { AxiosError } from 'axios'

export function getApiClient() {
  return axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL, withCredentials: true })
}

export const apiClient = getApiClient()
export const rawApiClient = getApiClient()

apiClient.interceptors.request.use(async config => {
  const { access, refresh } = await getTokens()

  await isTokensValid(access, refresh, access => {
    config.headers.Authorization = `Bearer ${access}`
  })

  return config
})

apiClient.interceptors.response.use(undefined, async error => {
  if (error instanceof AxiosError && error.config && [401, 403].includes(error.response?.status ?? 0)) {
    const { access, refresh } = await getTokens()

    const isValid = await isTokensValid(access, refresh, access => {
      if (error.config) {
        error.config.headers.Authorization = `Bearer ${access}`
      }
    })

    if (isValid) {
      error.config.baseURL = undefined
      return rawApiClient.request(error.config)
    }

    return Promise.reject(error)
  }

  return Promise.reject(error)
})
