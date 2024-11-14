'use client'

import Loading from '@/app/loading'
import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { useUser } from '@/providers/user-provider'
import { Request } from '@/types/entities/chat/request'

interface RequestChatWindowProps {
  request?: Request
  isLoading: boolean
}

export function RequestChatWindow({ request, isLoading }: RequestChatWindowProps) {
  const { user } = useUser()

  return (
    <ChatWindow>
      <p className="mb-20"></p>
      {isLoading ? (
        <Loading isFixed={false} />
      ) : (
        request?.messages.map(msg => (
          <ChatMessage
            isSender={user?.id === msg.sender.id}
            isAIGenerating={msg.sender.isAi && !msg.content}
            key={msg.id}
            {...msg}
          />
        ))
      )}
    </ChatWindow>
  )
}
