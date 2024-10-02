'use client'

import { ChatHeader } from '@/components/chat/header'
import { formatDate } from '@/lib/date'
import { Request } from '@/types/entities/user'

interface RequestChatHeaderProps {
  request: Request
}

export function RequestChatHeader({ request }: RequestChatHeaderProps) {
  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{`${request.mechanic.firstName} - ${request.chat.title}`}</p>
      <p className="hidden truncate whitespace-nowrap sm:block">{formatDate(request.createdAt)}</p>
    </ChatHeader>
  )
}
