'use client'

import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { Chat } from '@/types/entities/chat'
import { useRouter } from 'next/navigation'

import { AIChatHeader } from '../chat-header'
import { AIChatInput } from '../chat-input'
import { AIChatWindow } from '../chat-window'
import { useChat } from '../use-chat'

interface ChatProps {
  chatId?: number
}

export function ChatPage({ chatId }: ChatProps) {
  const router = useRouter()
  const { setChat } = useChat()
  const chat = useSWRCustom<Chat>(chatId ? `/chat/${chatId}` : null, {
    onSuccess: setChat,
    onError: () => router.push('/chat')
  })

  useFirstRenderEffect(() => {
    if (!chatId) setChat()
  })

  if (chatId && !chat.state.isLoading && !chat.state.data) return <Redirect url="/chat" />

  return (
    <div className="relative flex max-h-[calc(100dvh-4rem)] grow flex-col">
      <AIChatHeader />
      <AIChatWindow />
      <AIChatInput />
    </div>
  )
}
