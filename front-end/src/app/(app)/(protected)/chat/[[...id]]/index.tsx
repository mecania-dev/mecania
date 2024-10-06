'use client'

import { Redirect } from '@/components/redirect'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useIsLoading } from '@/hooks/use-is-loading'
import { api } from '@/http'
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
  const { chat, setChat } = useChat()
  const [fetchChat, isLoading] = useIsLoading(async () => {
    const res = await api.get<Chat>(`/chat/${chatId}`)
    if (!res.ok) router.push('/chat')
    setChat(res.data)
  }, true)

  useFirstRenderEffect(() => {
    if (!chatId) return setChat()
    fetchChat()
  })

  if (chatId && !isLoading && !chat) return <Redirect url="/chat" />

  return (
    <div className="relative flex max-h-[calc(100dvh-4rem)] grow flex-col">
      <AIChatHeader />
      <AIChatWindow isLoading={isLoading} />
      <AIChatInput isLoading={isLoading} />
    </div>
  )
}
