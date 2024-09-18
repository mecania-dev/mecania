'use client'

import { useRequests } from '@/mocks/use-requests'
import { redirect } from 'next/navigation'

import { RequestChatHeader } from './chat/chat-header'
import { RequestChatInput } from './chat/chat-input'
import { RequestChatWindow } from './chat/chat-window'

interface MechanicRequestProps {
  id: number
}

export function MechanicRequest({ id }: MechanicRequestProps) {
  // TODO: Remover depois que implementar o backend
  const { requests } = useRequests()
  const request = requests.find(r => r.id === id)
  // END TODO

  if (!request) return redirect('/profile')

  return (
    <div className="relative flex max-h-[calc(100dvh-64px)] grow flex-col">
      <RequestChatHeader request={request} />
      <RequestChatWindow request={request} />
      <RequestChatInput request={request} />
    </div>
  )
}
