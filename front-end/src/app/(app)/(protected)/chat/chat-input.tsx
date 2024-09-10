'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { uniqueId } from '@/lib/utils'
import { useChats } from '@/mocks/use-chats'
import { useUser } from '@/providers/user-provider'
import { Chat } from '@/types/entities/chat'
import { SendMessage, sendMessageSchema } from '@/types/entities/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

interface AIChatInputProps {
  chat?: Chat
}

export function AIChatInput({ chat }: AIChatInputProps) {
  // TODO: Remover depois que implementar o backend
  const { createChat, sendMessage } = useChats()

  const router = useRouter()
  const { user } = useUser()
  const form = useForm<SendMessage>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { chatId: chat?.id, senderId: user?.id }
  })
  const { isSubmitting, isValid } = form.formState
  const isAIGenerating = chat?.messages.some(m => m.sender === 'AI' && !m.message)
  const isDisabled = isSubmitting || isAIGenerating || !isValid

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  function onSubmit(message: SendMessage) {
    if (!message.chatId) {
      const newChat: Chat = {
        id: uniqueId(),
        title: message.message.slice(0, 20),
        messages: [],
        users: [user!],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      createChat(newChat)
      message.chatId = newChat.id
      sendMessage(message, user!)
      router.replace(`/chat/${newChat.id}`)
    } else {
      sendMessage(message, user!)
    }
    form.reset()
  }

  if (chat?.status === 'closed') return null

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
