import { useEffect, useRef, useState } from 'react'

import { env } from '@/env'
import { getCookie } from 'cookies-next'

export interface WebSocketProps<T = any> {
  isDisabled?: boolean
  onMessage?: (data: T) => void
  onError?: (e: Event) => void
  onOpen?: (e: Event) => void
  onClose?: (e: Event) => void
}

export function useWebSocket<T = any>(
  url: string,
  { isDisabled, onMessage, onError, onOpen, onClose }: WebSocketProps<T> = {}
) {
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isDisabled) return
    const fullUrl = new URL(env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') + url)
    fullUrl.searchParams.append('token', getCookie('access_token') ?? '')
    const socket = new WebSocket(fullUrl.href.replace('http', 'ws'))

    socket.onopen = e => {
      setIsConnected(true)
      if (onOpen) onOpen(e)
    }

    socket.onmessage = e => {
      const data = JSON.parse(e.data)
      if (onMessage) onMessage(data)
    }

    socket.onerror = e => {
      if (onError) onError(e)
    }

    socket.onclose = e => {
      setIsConnected(false)
      if (onClose) onClose(e)
    }

    socketRef.current = socket

    return () => {
      socket.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, url])

  function sendMessage<M = any>(message: M) {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return { sendMessage, isConnected }
}

export default useWebSocket
