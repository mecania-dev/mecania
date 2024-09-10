import { Request, RequestCreate } from '@/types/entities/request'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type RequestsStore = {
  requests: Request[]
  sendRequest: (request: RequestCreate) => void
  getRequests: (chat?: Request['chat']) => Request[]
  getRequest: (chat?: Request['chat'], mechanic?: Request['mechanic']) => Request | undefined
  removeRequest: (requestId?: number | number[]) => void
}

export const useRequests = create<RequestsStore>()(
  persist(
    (set, get) => ({
      requests: [],
      sendRequest: request => {
        return set(state => {
          if (state.requests.some(r => r.chat.id === request.chat.id && r.mechanic.id === request.mechanic.id)) {
            return state
          }

          state.requests.push({
            ...request,
            id: state.requests.length + 1,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          return { ...state }
        })
      },
      getRequests: chat => {
        const state = get()
        return chat ? state.requests.filter(r => r.chat.id === chat.id) : state.requests
      },
      getRequest: (chat, mechanic) => {
        if (!chat || !mechanic) return undefined
        const state = get()
        return state.requests.find(r => r.chat.id === chat.id && r.mechanic.id === mechanic.id)
      },
      removeRequest: requestId => {
        return set(state => {
          if (!requestId) return state
          const ids = Array.isArray(requestId) ? requestId : [requestId]
          state.requests = state.requests.filter(c => !ids.includes(c.id))
          return { ...state }
        })
      }
    }),
    {
      name: 'requests',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
