'use client'

import { useState } from 'react'

import { Redirect } from '@/components/redirect'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { Request } from '@/types/entities/chat/request'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { mutate } from 'swr'

import { RequestChatHeader } from './chat/chat-header'
import { RequestChatInput } from './chat/chat-input'
import { RequestChatWindow } from './chat/chat-window'
import { useRequest } from './use-chat'

interface MechanicRequestProps {
  id: number
}

function setCurrentRequestId(requestId?: number) {
  if (!requestId) return deleteCookie('currentRequestId')
  setCookie('currentRequestId', requestId.toString())
}

function isInvalidRequestId(requestId?: number) {
  return getCookie('currentRequestId') !== requestId?.toString()
}

export function MechanicRequest({ id }: MechanicRequestProps) {
  const isCreatedRequestId = getCookie('createdRequestId') === id?.toString()
  const { setRequest } = useRequest()
  const [isMutating, setIsMutating] = useState(id ? !isCreatedRequestId : false)
  const request = useSWRCustom<Request>(id ? `chat/requests/${id}` : null, {
    onSuccess: handleSuccess
  })

  async function handleSuccess(request: Request) {
    if (isInvalidRequestId(id)) return
    setRequest(request)
  }

  useFirstRenderEffect(() => {
    if (!isCreatedRequestId) {
      deleteCookie('createdRequestId')
    }
    setCurrentRequestId(id)

    if (!id) {
      setRequest()
      return
    }

    if (!isCreatedRequestId) {
      setIsMutating(true)
      mutate(`chat/requests/${id}`).then(() => setIsMutating(false))
    }
  })

  if (id && !request.state.isLoading && !request.state.data) return <Redirect url="/profile" />

  return (
    <div className="relative flex max-h-[calc(100dvh-4rem)] grow flex-col">
      <RequestChatHeader />
      <RequestChatWindow isLoading={request.state.isLoading || isMutating} />
      <RequestChatInput isLoading={request.state.isLoading || isMutating} />
    </div>
  )
}
