'use client'

import Loading from '@/app/loading'
import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { useChats } from '@/mocks/use-chats'

import { AIChatHeader } from '../chat-header'
import { AIChatInput } from '../chat-input'
import { AIChatWindow } from '../chat-window'

interface ChatProps {
  chatId?: number
}

export function Chat({ chatId }: ChatProps) {
  const isNew = !chatId
  const { state: chatState } = useSWRCustom(isNew ? null : null)
  // TODO: Remover depois que implementar o backend
  const { chats } = useChats()
  const chat = chats.find(c => c.id === chatId)

  if (!isNew && !chat) return <Redirect url="/chat" />

  if (!isNew && chatState.isLoading) return <Loading />

  return (
    <div className="relative flex max-h-[calc(100dvh-64px)] grow flex-col">
      <AIChatHeader chat={chat} />
      <AIChatWindow chat={chat} />
      <AIChatInput chat={chat} />
    </div>
  )
}
