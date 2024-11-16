'use client'

import { ChatHeader } from '@/components/chat/header'
import { formatDate } from '@/lib/date'

import { useRequest } from '../use-chat'

export function RequestChatHeader() {
  const { request } = useRequest()

  return (
    <ChatHeader classNames={{ body: 'space-x-2' }}>
      <p className="truncate whitespace-nowrap">{request?.title}</p>
      {request && <p className="hidden truncate whitespace-nowrap sm:block">{formatDate(request.createdAt)}</p>}
    </ChatHeader>
  )
}
