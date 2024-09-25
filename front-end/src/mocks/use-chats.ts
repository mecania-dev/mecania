import { delay } from '@/lib/promise'
import { uniqueId } from '@/lib/utils'
import { Chat } from '@/types/entities/chat'
import { SendMessage } from '@/types/entities/message'
import { User } from '@/types/entities/user'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { useServices } from './use-services'

const exampleMessages = [
  'Oi, estou com um problema no meu carro.',
  'Olá! Sinto muito por saber disso. Você pode descrever o problema que está enfrentando com o seu carro?',
  'Meu carro está fazendo um barulho estranho quando eu acelero.',
  'Entendi. Esse barulho é contínuo ou ocorre apenas em certos momentos?',
  'Ele acontece principalmente quando estou acelerando, mas às vezes também quando estou parado.',
  'O barulho é alto e metálico, ou é mais um zumbido?',
  'É um barulho metálico, como se algo estivesse raspando.',
  'Entendi. Você notou algum outro problema, como perda de potência ou aumento de consumo de combustível?',
  'Sim, parece que o carro está um pouco mais fraco e o consumo aumentou.',
  `Obrigado pelas informações. Pelo que você descreveu, parece que o problema pode estar relacionado ao sistema de exaustão ou ao motor. A categoria mais provável é "Problemas Mecânicos - Motor e Exaustão".
  
Aqui está o resumo do que entendi:

Barulho metálico ao acelerar e às vezes quando parado.
Perda de potência.
Aumento de consumo de combustível.

Isso está correto?`,
  'Sim, está correto.',
  'Obrigado! Agora, você pode clicar em "Oficinas" para selecionar oficinas especializadas na categoria "Problemas Mecânicos - Motor e Exaustão".'
]

type ChatsStore = {
  chats: Chat[]
  createChat: (chat: Chat) => void
  removeChat: (chatId?: number) => void
  sendMessage: (message: SendMessage, user: User) => Promise<void>
}

export const useChats = create<ChatsStore>()(
  persist(
    (set, get) => ({
      chats: [],
      createChat: chat => {
        return set(state => {
          state.chats.push(chat)
          return { ...state }
        })
      },
      removeChat: chatId => {
        return set(state => {
          if (!chatId) return state
          state.chats = state.chats.filter(c => c.id !== chatId)
          return { ...state }
        })
      },
      sendMessage: async (message, user) => {
        const chatId = message.chatId ? message.chatId : uniqueId()

        if (!message.chatId) {
          set(state => {
            state.chats.push({
              id: chatId,
              title: message.message.slice(0, 20),
              messages: [],
              users: [user],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            return { ...state }
          })
        }

        const chat = get().chats.find(c => c.id === chatId)
        const messagesLength = chat?.messages.length ?? 0
        const userMessage = exampleMessages[messagesLength]
        const AIMessage = exampleMessages[messagesLength + 1]

        chat?.messages.push({
          id: uniqueId(),
          chatId,
          sender: user,
          message: userMessage,
          sendDate: new Date().toISOString()
        })

        const aiMessageId = uniqueId()

        chat?.messages.push({
          id: aiMessageId,
          chatId,
          sender: 'AI',
          sendDate: new Date().toISOString()
        })

        set(state => ({ ...state }))

        await delay(1.5)

        const aiMessage = chat?.messages.find(m => m.id === aiMessageId)

        if (aiMessage) {
          aiMessage.message = AIMessage
        }

        if (messagesLength + 1 === exampleMessages.length - 1) {
          chat!.status = 'closed'

          const recommendations = useServices
            .getState()
            .services.filter(s => ['Problemas Mecânicos - Motor e Exaustão'].includes(s.category.name))

          chat!.recommendations = recommendations
        }

        return set(state => ({ ...state }))
      }
    }),
    {
      name: 'chats',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
