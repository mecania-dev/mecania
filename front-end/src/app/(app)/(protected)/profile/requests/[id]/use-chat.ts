import { Request } from '@/types/entities/chat/request'
import { create } from 'zustand'

export interface RequestStore {
  request?: Request
  messages: Request['messages']
  setRequest: (request?: Request) => void
  sendMessage: (message: Request['messages'][number]) => void
}

export const useRequest = create<RequestStore>()(set => ({
  messages: [],
  setRequest: request =>
    set(state => ({
      request,
      messages: state.request?.id === request?.id && state.messages.length ? state.messages : request?.messages ?? []
    })),
  sendMessage: message =>
    set(state => ({
      messages: [...state.messages, message]
    }))
}))
