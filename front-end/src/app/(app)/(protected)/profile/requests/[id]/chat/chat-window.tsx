'use client'

import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { Request } from '@/types/entities/user'

interface RequestChatWindowProps {
  request: Request
}

export function RequestChatWindow({ request }: RequestChatWindowProps) {
  return (
    <ChatWindow>
      <p className="mb-20"></p>
      <ChatMessage sender={request.mechanic} content={request.message} sentAt={request.createdAt} isSender={true} />
    </ChatWindow>
  )
}
