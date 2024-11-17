'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { ReadyState, useWebSocket } from '@/hooks/use-web-socket'
import { useUser } from '@/providers/user-provider'
import { Message, SendMessage, sendMessageSchema } from '@/types/entities/chat'
import { zodResolver } from '@hookform/resolvers/zod'
import { mutate } from 'swr'

import { useRequest } from '../use-chat'
import { UserActions } from './user-actions'

interface RequestChatInputProps {
  isLoading: boolean
}

export function RequestChatInput({ isLoading }: RequestChatInputProps) {
  const { isMechanic } = useUser()
  const { request, sendMessage, hasRatings, hasAIRatings } = useRequest()
  const form = useForm<SendMessage>({
    resolver: zodResolver(sendMessageSchema)
  })
  const socket = useWebSocket<Message>(request?.groupName ? `/ws/requests/${request.groupName}/` : null, { onMessage })

  const { isSubmitting, isValid } = form.formState
  const isDisabled = isLoading || socket.readyState !== ReadyState.OPEN || isSubmitting || !isValid
  const myStatus = isMechanic ? request?.mechanicStatus : request?.driverStatus
  const otherStatus = isMechanic ? request?.driverStatus : request?.mechanicStatus
  const isRated =
    myStatus === 'resolved' && otherStatus === 'resolved' && (isMechanic ? hasAIRatings : hasRatings && hasAIRatings)

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  function onMessage(e: MessageEvent<any>) {
    if (!request) return
    const data = JSON.parse(e.data)

    sendMessage(data)
    mutate(`chat/requests/${request.id}`)
  }

  function onSubmit({ message }: SendMessage) {
    form.reset()
    socket.sendJsonMessage({ message })
  }

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="mx-auto flex w-full flex-col gap-2 px-5 pb-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
    >
      {isRated && <p className="text-center text-small text-default-500">Essa conversa foi encerrada</p>}
      <UserActions isLoading={isLoading} />
      <ChatInput
        maxLength={1024}
        submitProps={{ isDisabled }}
        onSubmit={form.handleSubmit(onSubmit)}
        isDisabled={
          !request?.accepted || (request?.driverStatus === 'closed' && request?.mechanicStatus === 'closed') || isRated
        }
        fullWidth
        {...form.register('message')}
      />
    </Form>
  )
}
