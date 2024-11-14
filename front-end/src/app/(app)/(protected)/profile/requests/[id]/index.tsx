'use client'

import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { Request } from '@/types/entities/chat/request'

import { RequestChatHeader } from './chat/chat-header'
import { RequestChatInput } from './chat/chat-input'
import { RequestChatWindow } from './chat/chat-window'

interface MechanicRequestProps {
  id: number
}

export function MechanicRequest({ id }: MechanicRequestProps) {
  const request = useSWRCustom<Request>(id ? `chat/requests/${id}` : null)

  if (id && !request.state.isLoading && !request.state.data) return <Redirect url="/profile" />

  return (
    <div className="relative flex max-h-[calc(100dvh-4rem)] grow flex-col">
      <RequestChatHeader request={request.state.data} />
      <RequestChatWindow request={request.state.data} isLoading={request.state.isLoading} />
      <RequestChatInput request={request.state.data} isLoading={request.state.isLoading} />
    </div>
  )
}
