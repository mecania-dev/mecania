import { useMechanics } from '@/mocks/use-mechanics'
import { Chat } from '@/types/entities/chat'
import { Mechanic } from '@/types/entities/mechanic'
import { flatMap, uniq } from 'lodash'
import { create } from 'zustand'

export type RecommendationsStore = {
  chat?: Chat
  mechanics: Mechanic[]
  selectedMechanics: Mechanic[]
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
  setSelectedMechanics: (mechanics: string[]) => void
  openModal: (chat: Chat) => () => void
  setIsModalOpen: (isOpen: boolean) => void
  openSendModal: () => void
  setIsSendOpen: (isOpen: boolean) => void
  setIsFilterOpen: (isOpen: boolean) => void
  setFilters: (
    filters:
      | RecommendationsStore['filters']
      | ((filters: RecommendationsStore['filters']) => RecommendationsStore['filters'])
  ) => void
  setSearchQuery: (query: string) => void
}

export const useRecommendations = create<RecommendationsStore>()(set => ({
  mechanics: useMechanics.getState().mechanics,
  selectedMechanics: [],
  isModalOpen: false,
  isSendOpen: false,
  isFilterOpen: false,
  filters: {
    ratings: {
      min: 0,
      max: 5
    },
    distance: {
      min: 0,
      max: 10
    },
    cities: uniq(flatMap(useMechanics.getState().mechanics, 'addresses').map(a => a.city))
  },
  searchQuery: '',
  setSelectedMechanics: mechanics =>
    set(state => {
      const selectedMechanics = mechanics.reduce((acc, id) => {
        const mechanic = state.mechanics.find(m => String(m.id) === id)
        if (mechanic) acc.push(mechanic)
        return acc
      }, [] as Mechanic[])

      return { selectedMechanics }
    }),
  openModal: (chat: Chat) => () => set({ chat, isModalOpen: true }),
  setIsModalOpen: (isOpen: boolean) =>
    set({
      selectedMechanics: [],
      isModalOpen: isOpen,
      isSendOpen: false,
      isFilterOpen: false,
      filters: {
        ratings: {
          min: 0,
          max: 5
        },
        distance: {
          min: 0,
          max: 10
        },
        cities: uniq(flatMap(useMechanics.getState().mechanics, 'addresses').map(a => a.city))
      },
      searchQuery: ''
    }),
  openSendModal: () => set({ isSendOpen: true }),
  setIsSendOpen: (isOpen: boolean) => set({ isSendOpen: isOpen }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilters: filters =>
    set(state => {
      const filtersData = typeof filters === 'function' ? filters(state.filters) : filters
      return { filters: filtersData }
    }),
  setIsFilterOpen: (isOpen: boolean) => set({ isFilterOpen: isOpen })
}))
