'use client'

import { HiOutlineSparkles } from 'react-icons/hi2'

import Loading from '@/app/loading'
import { Button } from '@/components/button'
import { ChatMessage } from '@/components/chat/message'
import { ChatWindow } from '@/components/chat/window'
import { useUser } from '@/providers/user-provider'

import { InitialQuestions } from './initial-questions'
import { ChatRecommendations } from './recommendations'
import { useChat } from './use-chat'
import { VehicleSelector } from './vehicle-selector'

interface AIChatWindowProps {
  isLoading: boolean
}

export function AIChatWindow({ isLoading }: AIChatWindowProps) {
  const { user } = useUser()
  const { chat, messages, recommendations, isAiGenerating, getCurrentQuestion } = useChat()
  const { isAllAnswered } = getCurrentQuestion()

  return (
    <ChatWindow>
      <p className="mb-20"></p>
      {isLoading && !isAllAnswered ? (
        <Loading isFixed={false} />
      ) : (
        <>
          <VehicleSelector />
          <InitialQuestions />
          {messages.map(msg => (
            <ChatMessage
              isSender={user?.id === msg.sender.id}
              isAIGenerating={msg.sender.isAi && !msg.content}
              key={msg.id}
              {...msg}
            />
          ))}
          {isAiGenerating && (
            <ChatMessage
              content=""
              sender={chat?.members.find(m => m.isAi) as any}
              sentAt={new Date().toISOString()}
              isSender={false}
              isAIGenerating
            />
          )}
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
        </>
      )}
    </ChatWindow>
  )
}
