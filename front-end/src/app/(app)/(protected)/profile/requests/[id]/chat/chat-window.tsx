'use client'

import Loading from '@/app/loading'
import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { useUser } from '@/providers/user-provider'

import { useRequest } from '../use-chat'
import { Feedbacks } from './feedbacks'

interface RequestChatWindowProps {
  isLoading: boolean
}

export function RequestChatWindow({ isLoading }: RequestChatWindowProps) {
  const { user } = useUser()
  const { messages } = useRequest()

  return (
    <ChatWindow>
      <p className="mb-20"></p>
      {isLoading ? (
        <Loading isFixed={false} />
      ) : (
        <>
          <Feedbacks />
          {messages.map(msg => (
            <ChatMessage
              isSender={user?.id === msg.sender.id}
              isAIGenerating={msg.sender.isAi && !msg.content}
              key={msg.id}
              {...msg}
            />
          ))}
        </>
      )}
    </ChatWindow>
  )
}
