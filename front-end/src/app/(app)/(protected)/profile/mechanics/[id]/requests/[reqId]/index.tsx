'use client'

import Loading from '@/app/loading'
import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useMechanics } from '@/mocks/use-mechanics'
import { useRequests } from '@/mocks/use-requests'

import { RequestChatHeader } from './chat/chat-header'
import { RequestChatInput } from './chat/chat-input'
import { RequestChatWindow } from './chat/chat-window'

interface MechanicRequestProps {
  mechanicId: number
  requestId: number
}

export function MechanicRequest({ mechanicId, requestId }: MechanicRequestProps) {
  const { state: mechanicState } = useSWRCustom(null)
  // TODO: Remover depois que implementar o backend
  const { mechanics } = useMechanics()
  const mechanic = mechanics.find(m => m.id === mechanicId)
  // END TODO
  const { state: reqState } = useSWRCustom(mechanic ? null : null)
  // TODO: Remover depois que implementar o backend
  const { requests } = useRequests()
  const request = requests.find(r => r.id === requestId)
  // END TODO

  if (!mechanic || !request) return <Redirect url="/profile" />

  if (mechanicState.isLoading || reqState.isLoading) return <Loading />

  return (
    <div className="relative flex max-h-[calc(100dvh-64px)] grow flex-col">
      <RequestChatHeader request={request} />
      <RequestChatWindow request={request} />
      <RequestChatInput request={request} />
    </div>
  )
}
