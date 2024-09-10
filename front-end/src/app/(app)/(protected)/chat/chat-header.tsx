'use client'

import { ChatHeader } from '@/components/chat/header'
import { Chat } from '@/types/entities/chat'
import { format } from 'date-fns'

interface AIChatHeaderProps {
  chat?: Chat
}

export function AIChatHeader({ chat }: AIChatHeaderProps) {
  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{chat ? chat.title : 'Novo Chat'}</p>
      <p className="hidden truncate whitespace-nowrap sm:block">
        {chat ? format(chat.createdAt, 'dd/MM/yyyy HH:mm') : format(new Date(), 'dd/MM/yyyy HH:mm')}
      </p>
    </ChatHeader>
  )
}
