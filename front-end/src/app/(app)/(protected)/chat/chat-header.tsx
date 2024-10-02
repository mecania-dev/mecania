'use client'

import { ChatHeader } from '@/components/chat/header'
import { formatDate } from '@/lib/date'

import { useChat } from './use-chat'

export function AIChatHeader() {
  const { chat } = useChat()

  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{chat ? chat.title : 'Novo Chat'}</p>
      <p className="hidden truncate whitespace-nowrap sm:block">
        {chat ? formatDate(chat.createdAt) : formatDate(new Date())}
      </p>
    </ChatHeader>
  )
}
