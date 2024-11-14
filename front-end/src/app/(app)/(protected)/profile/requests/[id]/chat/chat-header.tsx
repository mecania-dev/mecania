'use client'

import { ChatHeader } from '@/components/chat/header'
import { formatDate } from '@/lib/date'
import { Request } from '@/types/entities/chat/request'

interface RequestChatHeaderProps {
  request?: Request
}

export function RequestChatHeader({ request }: RequestChatHeaderProps) {
  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{request?.title}</p>
      {request && <p className="hidden truncate whitespace-nowrap sm:block">{formatDate(request.createdAt)}</p>}
    </ChatHeader>
  )
}
