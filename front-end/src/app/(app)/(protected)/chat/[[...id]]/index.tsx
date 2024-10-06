'use client'

import { useState } from 'react'

import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { Chat } from '@/types/entities/chat'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

import { AIChatHeader } from '../chat-header'
import { AIChatInput } from '../chat-input'
import { AIChatWindow } from '../chat-window'
import { useChat } from '../use-chat'

interface ChatProps {
  chatId?: number
}

function setCurrentChatId(chatId?: number) {
  if (!chatId) return deleteCookie('currentChatId')
  setCookie('currentChatId', chatId.toString())
}

function isInvalidChatId(chatId?: number) {
  return getCookie('currentChatId') !== chatId?.toString()
}

export function ChatPage({ chatId }: ChatProps) {
  const router = useRouter()
  const isCreatedChatId = getCookie('createdChatId') === chatId?.toString()
  const { setChat, resetInitialQuestions } = useChat()
  const [isMutating, setIsMutating] = useState(chatId ? !isCreatedChatId : false)
  const chat = useSWRCustom<Chat>(chatId ? `/chat/${chatId}` : null, {
    onSuccess: handleSuccess,
    onError: () => router.push('/chat')
  })

  async function handleSuccess(chat: Chat) {
    if (isInvalidChatId(chatId)) return
    setChat(chat)
  }

  useFirstRenderEffect(() => {
    if (!isCreatedChatId) {
      resetInitialQuestions()
      deleteCookie('createdChatId')
    }
    setCurrentChatId(chatId)

    if (!chatId) {
      setChat()
      return
    }

    if (!isCreatedChatId) {
      setIsMutating(true)
      mutate(`/chat/${chatId}`).then(() => setIsMutating(false))
    }
  })

  if (chatId && !chat.state.isLoading && !chat.state.data) return <Redirect url="/chat" />

  return (
    <div className="relative flex max-h-[calc(100dvh-4rem)] grow flex-col">
      <AIChatHeader />
      <AIChatWindow isLoading={chat.state.isLoading || isMutating} />
      <AIChatInput isLoading={chat.state.isLoading || isMutating} />
    </div>
  )
}
