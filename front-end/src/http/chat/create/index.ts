import { api, ApiRequestConfig } from '@/http'
import { Chat } from '@/types/entities/chat'

import { ChatCreateOutput } from './types'

export * from './types'

export async function createChat(payload: ChatCreateOutput, config?: ApiRequestConfig<Chat>) {
  return await api.post<Chat>('chat/', payload, config)
}
