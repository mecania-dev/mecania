import { env } from '@/env'
import { clientCookies } from '@/lib/cookies/client'
import { tryParseJSON } from '@/lib/object'
import axios from 'axios'

export const apiClient = axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL })

apiClient.interceptors.request.use(async config => {
  let token: string | undefined
  
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    const tokens = serverCookies().get('tokens')?.value
    token = tryParseJSON(tokens, null)?.access.token
  }else{
    const tokens = clientCookies.get('tokens', null)
    token = tokens?.access.token
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
