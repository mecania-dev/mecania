import { Chat } from '@/types/entities/chat'
import { User, Vehicle } from '@/types/entities/user'
import { create, StoreApi } from 'zustand'

import { getNotAnsweredQuestion, getInitialQuestions } from './initial-questions'
import { Question } from './types'

export * from './types'
export * from './initial-questions'

export const defaultRecommendationsFilters = {
  ratings: { min: 0, max: 5 },
  distance: { min: 0, max: 50 },
  cities: []
}

export interface ChatStore {
  chat?: Chat
  vehicle?: Vehicle
  messages: Chat['messages']
  initialQuestions: Question[]
  firstMessage: string
  isAiGenerating: boolean
  summary?: string
  mechanicsWithRequest: number[]
  setChat: (chat?: Chat) => void
  setVehicle: (vehicle: Vehicle) => void
  sendMessage: (message: Chat['messages'][number]) => void
  answerQuestion: (questionIndex: number, updatedQuestion: Question) => void
  getCurrentQuestion: () => {
    currentQuestion?: Question
    index: number
    isLastQuestion: boolean
    isAllAnswered: boolean
  }
  resetInitialQuestions: () => void
  setFirstMessage: (message: string) => void
  setIsAiGenerating: (isGenerating: boolean) => void
  setSummary: (summary?: string) => void
  setMechanicsWithRequest: (mechanics: number[]) => void
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
  initialQuestions: getInitialQuestions(),
  firstMessage: '',
  isAiGenerating: false,
  mechanicsWithRequest: [],
  setChat: chat =>
    set(state => ({
      chat,
      vehicle: chat?.vehicle,
      messages: state.chat?.id === chat?.id && state.messages.length ? state.messages : chat?.messages ?? [],
      mechanicsWithRequest: state.chat?.id === chat?.id ? state.mechanicsWithRequest : [],
      isAiGenerating: chat ? state.isAiGenerating : false,
      recommendations: chat ? state.recommendations : createRecommendations(set)
    })),
  setVehicle: vehicle => set({ vehicle }),
  sendMessage: message => {
    set(state => {
      state.messages.push(message)
      return { messages: state.messages }
    })
  },
  answerQuestion: (questionIndex, updatedQuestion) => {
    const { initialQuestions } = get()
    const question = initialQuestions[questionIndex]

    function updateFollowUp(question: Question | undefined, updatedQuestion: Question): boolean {
      if (!question) return false

      // If the question's text matches the updated question, update its answer
      if (question.text === updatedQuestion.text) {
        question.answer = updatedQuestion.answer
        return true
      }

      // If it's an options question, iterate through the options and check their follow-ups
      if (question.type === 'options') {
        for (const option of question.options) {
          // Check if the selected option has `end: true`, and stop updating if so
          if (option.text === question.answer && option.end) {
            return false
          }
          // If the option's text matches the updated question, update its answer
          if (option.text === updatedQuestion.answer) {
            question.answer = updatedQuestion.answer
            return true
          }
          // Follow-up, recurse
          if (typeof option.followUp === 'object') {
            return updateFollowUp(option.followUp, updatedQuestion)
          }
        }
      }

      // If it's a text question with a follow-up, recurse
      if (question.type === 'text' && typeof question.followUp === 'object') {
        return updateFollowUp(question.followUp, updatedQuestion)
      }

      return false
    }

    const found = updateFollowUp(question, updatedQuestion)

    if (!found) return

    set({ initialQuestions: [...initialQuestions] })
  },
  getCurrentQuestion: () => {
    const { initialQuestions } = get()

    for (let i = 0; i < initialQuestions.length; i++) {
      const q = initialQuestions[i]
      const notAnsweredQuestion = getNotAnsweredQuestion(q)

      if (notAnsweredQuestion)
        return {
          currentQuestion: notAnsweredQuestion,
          index: i,
          isLastQuestion: i === initialQuestions.length - 1,
          isAllAnswered: false
        }
    }

    return {
      index: initialQuestions.length - 1,
      isLastQuestion: true,
      isAllAnswered: true
    }
  },
  resetInitialQuestions: () => set({ initialQuestions: getInitialQuestions() }),
  setFirstMessage: message => set({ firstMessage: message }),
  setIsAiGenerating: isGenerating => set({ isAiGenerating: isGenerating }),
  setSummary: summary => set({ summary }),
  setMechanicsWithRequest: mechanics => set({ mechanicsWithRequest: mechanics }),
  recommendations: createRecommendations(set)
}))

function createRecommendations(set: StoreApi<ChatStore>['setState']): ChatStore['recommendations'] {
  return {
    mechanics: [],
    selectedMechanics: [],
    isModalOpen: false,
    isSendOpen: false,
    isFilterOpen: false,
    filters: { ...defaultRecommendationsFilters },
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
          filters: { ...defaultRecommendationsFilters },
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
