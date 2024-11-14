import useReactWebSocket, { Options } from 'react-use-websocket'

import { env } from '@/env'
import { getCookie } from 'cookies-next'

export * from 'react-use-websocket'

function getSocketUrl(url: string) {
  const fullUrl = new URL(env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') + url)
  fullUrl.searchParams.append('token', getCookie('access_token') ?? '')
  return fullUrl.href.replace('http', 'ws')
}

export function useWebSocket<T = any>(url: string | null, options?: Options, connect?: boolean) {
  return useReactWebSocket<T>(url ? getSocketUrl(url) : null, options, connect)
}
