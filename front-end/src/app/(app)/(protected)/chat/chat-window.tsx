'use client'

import { HiOutlineSparkles } from 'react-icons/hi2'

import { Button } from '@/components/button'
import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { useUser } from '@/providers/user-provider'

import { ChatRecommendations } from './recommendations'
import { useChat } from './use-chat'

export function AIChatWindow() {
  const { user } = useUser()
  const { chat, messages, recommendations } = useChat()

  return (
    <ChatWindow>
      <p className="mb-20"></p>
      {messages.map(msg => (
        <ChatMessage
          isSender={user?.id === msg.sender.id}
          isAIGenerating={msg.sender.isAi && !msg.content}
          key={msg.id}
          {...msg}
        />
      ))}
      {chat?.issues.some(i => i.recommendations.length > 0) && (
        <div className="!my-10 animate-appearance-in text-center">
          <Button
            size="lg"
            data-modal-open={recommendations.isModalOpen}
            className="bg-gradient-to-tr from-primary via-[#CDCDCD] to-secondary font-bold text-default-50 shadow-lg"
            startContent={
              <HiOutlineSparkles className="h-6 w-6 shrink-0 rotate-0 animate-[spinner-spin_0.8s_ease] transition-transform duration-500 group-data-[modal-open=true]:rotate-[360deg]" />
            }
            onPress={recommendations.openModal}
          >
            Oficinas
          </Button>
          <ChatRecommendations />
        </div>
      )}
    </ChatWindow>
  )
}
