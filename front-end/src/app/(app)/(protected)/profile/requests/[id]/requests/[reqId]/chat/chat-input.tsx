'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { useUser } from '@/providers/user-provider'
import { SendMessage, sendMessageSchema } from '@/types/entities/message'
import { Request } from '@/types/entities/request'
import { zodResolver } from '@hookform/resolvers/zod'

interface RequestChatInputProps {
  request: Request
}

export function RequestChatInput({ request }: RequestChatInputProps) {
  const { user } = useUser()
  const form = useForm<SendMessage>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { chatId: request.id, senderId: user?.id }
  })
  const { isSubmitting, isValid } = form.formState
  const isDisabled = isSubmitting || !isValid

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  function onSubmit(message: SendMessage) {
    console.log(message)
    form.reset()
  }

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="mx-auto flex w-full px-5 pb-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
    >
      <ChatInput
        maxLength={1024}
        submitProps={{ isDisabled }}
        onSubmit={form.handleSubmit(onSubmit)}
        fullWidth
        {...form.register('message')}
      />
    </Form>
  )
}
