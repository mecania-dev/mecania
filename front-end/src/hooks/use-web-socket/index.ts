import { useEffect, useRef, useState } from 'react'

import { env } from '@/env'
import { getCookie } from 'cookies-next'

export interface WebSocketProps<T = any> {
  maxRetries?: number
  retryDelay?: number
  isDisabled?: boolean
  onMessage?: (data: T) => void
  onError?: (e: Event) => void
  onOpen?: (e: Event) => void
  onClose?: (e: Event) => void
}

let timeout: NodeJS.Timeout

export function useWebSocket<T = any>(
  url: string,
  { maxRetries = 5, retryDelay = 1000, isDisabled, onMessage, onError, onOpen, onClose }: WebSocketProps<T> = {}
) {
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(false) // New state for tracking if connecting
  const [isConnected, setIsConnected] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (isDisabled || isConnecting || isConnected) return // Avoid reconnection if already connecting or connected

    const connectWebSocket = () => {
      setIsConnecting(true) // Set connecting state to true
      const fullUrl = new URL(env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') + url)
      fullUrl.searchParams.append('token', getCookie('access_token') ?? '')
      const socket = new WebSocket(fullUrl.href.replace('http', 'ws'))

      socket.onopen = e => {
        if (onOpen) onOpen(e)
        setRetryCount(0) // Reset retry count on successful connection
        setIsConnected(true)
        setIsConnecting(false) // Set connecting state to false
      }

      socket.onmessage = e => {
        const data = JSON.parse(e.data)
        if (onMessage) onMessage(data)
      }

      socket.onerror = e => {
        if (onError) onError(e)
      }

      socket.onclose = e => {
        if (onClose) onClose(e)

        setIsConnecting(false) // Set connecting state to false on close
        setIsConnected(false) // Set connected state to false

        // Retry logic
        if (!isConnecting && !isConnected && retryCount < maxRetries) {
          setRetryCount(prevCount => prevCount + 1)
          timeout = setTimeout(connectWebSocket, Math.min(retryDelay * Math.pow(2, retryCount), 30000))
        }
      }

      socketRef.current = socket
    }

    connectWebSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, url, retryCount, maxRetries, retryDelay])

  function sendMessage<M = any>(message: M) {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return { sendMessage, isConnected }
}

export default useWebSocket
