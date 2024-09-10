'use client'

import { HiOutlineSparkles } from 'react-icons/hi2'

import { Button } from '@/components/button'
import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { useUser } from '@/providers/user-provider'
import { Chat } from '@/types/entities/chat'

import { ChatRecommendations } from './recommendations'
import { useRecommendations } from './recommendations/use-recommendations'

interface AIChatWindowProps {
  chat?: Chat
}

export function AIChatWindow({ chat }: AIChatWindowProps) {
  const { user } = useUser()
  const recommendations = useRecommendations()
  const isSameUser = chat?.users.some(u => u.id === user?.id)

  return (
    <ChatWindow>
      <p className="mb-20"></p>
      {chat?.messages.map(msg => (
        <ChatMessage
          isAI={msg.sender === 'AI'}
          isSender={msg.sender !== 'AI' && user?.id === msg.sender.id}
          isAIGenerating={msg.sender === 'AI' && !msg.message}
          key={msg.id}
          {...msg}
        />
      ))}
      {chat?.recommendations && isSameUser && (
        <div className="!my-10 animate-appearance-in text-center">
          <Button
            size="lg"
            data-modal-open={recommendations.isModalOpen}
            className="bg-gradient-to-tr from-primary via-[#CDCDCD] to-secondary font-bold text-default-50 shadow-lg"
            startContent={
              <HiOutlineSparkles className="h-6 w-6 shrink-0 rotate-0 animate-[spinner-spin_0.8s_ease] transition-transform duration-500 group-data-[modal-open=true]:rotate-[360deg]" />
            }
            onPress={recommendations.openModal(chat)}
          >
            Oficinas
          </Button>
          <ChatRecommendations />
        </div>
      )}
    </ChatWindow>
  )
}
