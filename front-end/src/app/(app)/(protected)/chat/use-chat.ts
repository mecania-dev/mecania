import { Chat } from '@/types/entities/chat'
import { User } from '@/types/entities/user'
import { create, StoreApi } from 'zustand'

export const defaultRecommendationsFilters = {
  ratings: { min: 0, max: 5 },
  distance: { min: 0, max: 10 },
  cities: []
}

export interface ChatStore {
  chat?: Chat
  setChat: (chat?: Chat) => void
  initialQuestions?: {}[]
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

export const useChat = create<ChatStore>()(set => ({
  setChat: chat => set(state => ({ chat, recommendations: chat ? state.recommendations : createRecommendations(set) })),
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
