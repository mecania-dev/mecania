'use client'

import { LuTrash2 } from 'react-icons/lu'

import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { confirmationModal } from '@/hooks/use-confirmation-modal'
import { useChats } from '@/mocks/use-chats'
import { compareDesc, parseISO } from 'date-fns'

import { NewChatButton } from './new-chat-button'

export function ChatHistory() {
  // TODO: Remover depois que implementar o backend
  const { chats, removeChat } = useChats()
  const {} = useSWRCustom(null, { fallbackData: chats })
  const sortedChats = chats.sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)))

  const handleChatRemove = (chatId?: number) => (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()

    confirmationModal({
      size: 'sm',
      title: 'Excluir conversa',
      question: 'Tem certeza que deseja excluir essa conversa?',
      onConfirm: () => removeChat(chatId)
    })
  }

  return (
    <div className="w-0 space-y-3 overflow-hidden transition-width group-data-[chat=true]:w-full">
      <NewChatButton />
      <div className="space-y-1">
        {sortedChats.map((chat, i) => (
          <SidebarRoute
            href={`/chat/${chat.id}`}
            variant="ghost"
            activeVariant="solid"
            classNames={{ text: 'truncate' }}
            endContent={
              <LuTrash2
                className="hidden h-5 w-5 shrink-0 text-danger group-data-[active=true]:block group-data-[hover=true]:block hover:scale-105"
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
