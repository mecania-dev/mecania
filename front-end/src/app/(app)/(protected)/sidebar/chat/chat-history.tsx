'use client'

import { LuTrash2 } from 'react-icons/lu'

import { confirmationModal } from '@/components/modal'
import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { compareDates } from '@/lib/date'
import { Chat } from '@/types/entities/chat'

import { EmptyHistory } from '../empty-history'
import { NewChatButton } from './new-chat-button'

export function ChatHistory() {
  const chats = useSWRCustom<Chat[]>('chat/', {
    fetcherConfig: { params: { paginate: false } }
  })
  const sortedChats = chats.state.data?.sort((a, b) => compareDates(a.updatedAt, b.updatedAt, 'desc')) ?? []

  const handleChatRemove = (chatId?: number) => (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()

    confirmationModal({
      size: 'sm',
      title: 'Excluir conversa',
      question: 'Tem certeza que deseja excluir essa conversa?',
      onConfirm: () => chats.remove({ url: url => url + chatId })
    })
  }

  return (
    <div className="w-0 space-y-3 overflow-hidden transition-width group-data-[chat=true]:w-full">
      <NewChatButton />
      <div className="space-y-1">
        {sortedChats.length === 0 && (
          <EmptyHistory
            title="Nenhuma conversa iniciada"
            description="Inicie uma nova conversa para descrever o problema do seu veículo e receba recomendações"
          />
        )}
        {sortedChats.map((chat, i) => (
          <SidebarRoute
            canProps={{ I: 'ask_ai', a: 'Chat' }}
            href={`/chat/${chat.id}`}
            variant="ghost"
            activeVariant="solid"
            classNames={{ text: 'truncate' }}
            endContent={
              <LuTrash2
                className="hidden h-5 w-5 shrink-0 text-danger hover:scale-105 group-data-[active=true]:block group-data-[hover=true]:block"
                onClick={handleChatRemove(chat.id)}
              />
            }
            key={`${i}-${chat.id}`}
          >
            {chat.title}
          </SidebarRoute>
        ))}
      </div>
    </div>
  )
}
