import { Chat } from '@/types/entities/chat'
import { User, Vehicle } from '@/types/entities/user'
import { create, StoreApi } from 'zustand'

import { initialQuestions } from './initial-questions'
import { Question } from './types'

export * from './types'
export * from './initial-questions'

export const defaultRecommendationsFilters = {
  ratings: { min: 0, max: 5 },
  distance: { min: 0, max: 10 },
  cities: []
}

export interface ChatStore {
  chat?: Chat
  vehicle?: Vehicle
  messages: Chat['messages']
  initialQuestions: Question[]
  setChat: (chat?: Chat) => void
  setVehicle: (vehicle: Vehicle) => void
  sendMessage: (message: string, sender: User) => void
  getCurrentQuestion: () => Question
  recommendations: {
    mechanics: User[]
    selectedMechanics: User[]
    isModalOpen: boolean
    isSendOpen: boolean
    isFilterOpen: boolean
    filters: {
      ratings: {
        min: number
        max: number
      }
      distance: {
        min: number
        max: number
      }
      cities: string[]
    }
    searchQuery: string
    setMechanics: (mechanics: User[]) => void
    setSelectedMechanics: (mechanics: string[]) => void
    openModal: () => void
    setIsModalOpen: (isOpen: boolean) => void
    openSendModal: () => void
    setIsSendOpen: (isOpen: boolean) => void
    setIsFilterOpen: (isOpen: boolean) => void
    setFilters: (
      filters:
        | ChatStore['recommendations']['filters']
        | ((filters: ChatStore['recommendations']['filters']) => ChatStore['recommendations']['filters'])
    ) => void
    setSearchQuery: (query: string) => void
  }
}

export const useChat = create<ChatStore>()((set, get) => ({
  messages: [],
  initialQuestions,
  setChat: chat =>
    set(state => ({
      chat,
      vehicle: chat?.vehicle,
      messages: chat?.messages ?? [],
      recommendations: chat ? state.recommendations : createRecommendations(set)
    })),
  setVehicle: vehicle => set({ vehicle }),
  sendMessage: (message, sender) => {
    set(state => {
      state.messages.push({
        id: state.messages.length + 1,
        content: message,
        sender: { id: sender.id, username: sender.username, isAi: sender.isAi },
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return { messages: state.messages }
    })
  },
  getCurrentQuestion: () => {
    const { initialQuestions } = get()
    return initialQuestions.find((q, i) => !q.answer || i === initialQuestions.length - 1)!
  },
  recommendations: createRecommendations(set)
}))

function createRecommendations(set: StoreApi<ChatStore>['setState']): ChatStore['recommendations'] {
  return {
    mechanics: [],
    selectedMechanics: [],
    isModalOpen: false,
    isSendOpen: false,
    isFilterOpen: false,
    filters: defaultRecommendationsFilters,
    searchQuery: '',
    setMechanics: mechanics =>
      set(state => ({
        recommendations: {
          ...state.recommendations,
          mechanics
        }
      })),
    setSelectedMechanics: mechanics =>
      set(state => {
        const selectedMechanics = mechanics.reduce((acc, id) => {
          const mechanic = state.recommendations.mechanics.find(m => String(m.id) === id)
          if (mechanic) acc.push(mechanic)
          return acc
        }, [] as User[])

        return { recommendations: { ...state.recommendations, selectedMechanics } }
      }),
    openModal: () => set(state => ({ recommendations: { ...state.recommendations, isModalOpen: true } })),
    setIsModalOpen: (isOpen: boolean) =>
      set(state => ({
        recommendations: {
          ...state.recommendations,
          selectedMechanics: [],
          isModalOpen: isOpen,
          isSendOpen: false,
          isFilterOpen: false,
          filters: defaultRecommendationsFilters,
          searchQuery: ''
        }
      })),
    openSendModal: () => set(state => ({ recommendations: { ...state.recommendations, isSendOpen: true } })),
    setIsSendOpen: (isOpen: boolean) =>
      set(state => ({ recommendations: { ...state.recommendations, isSendOpen: isOpen } })),
    setIsFilterOpen: (isOpen: boolean) =>
      set(state => ({ recommendations: { ...state.recommendations, isFilterOpen: isOpen } })),
    setFilters: filters =>
      set(state => {
        const filtersData = typeof filters === 'function' ? filters(state.recommendations.filters) : filters
        return { recommendations: { ...state.recommendations, filters: filtersData } }
      }),
    setSearchQuery: (query: string) =>
      set(state => ({ recommendations: { ...state.recommendations, searchQuery: query } }))
  }
}
