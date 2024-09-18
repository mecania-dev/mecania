'use client'

import { ChatHeader } from '@/components/chat/header'
import { Request } from '@/types/entities/request'
import { format } from 'date-fns'

interface RequestChatHeaderProps {
  request: Request
}

export function RequestChatHeader({ request }: RequestChatHeaderProps) {
  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{`${request.mechanic.firstName} - ${request.chat.title}`}</p>
      <p className="hidden truncate whitespace-nowrap sm:block">{format(request.createdAt, 'dd/MM/yyyy HH:mm')}</p>
    </ChatHeader>
  )
}
