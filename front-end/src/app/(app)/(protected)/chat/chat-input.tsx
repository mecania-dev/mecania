'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { useUser } from '@/providers/user-provider'

import { useChat } from './use-chat'

export function AIChatInput() {
  // const router = useRouter()
  const { user } = useUser()
  const { chat } = useChat()
  const form = useForm<any>({
    // resolver: zodResolver(sendMessageSchema),
    defaultValues: { chatId: chat?.id, senderId: user?.id }
  })
  const { isSubmitting, isValid } = form.formState
  const isDisabled = isSubmitting || !isValid

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  // function onSubmit(message: SendMessage) {
  function onSubmit() {
    // if (!message.chatId) {
    //   const newChat: Chat = {
    //     id: uniqueId(),
    //     title: message.message.slice(0, 20),
    //     messages: [],
    //     users: [user!],
    //     status: 'active',
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString()
    //   }
    //   createChat(newChat)
    //   message.chatId = newChat.id
    //   sendMessage(message, user!)
    //   router.replace(`/chat/${newChat.id}`)
    // } else {
    //   sendMessage(message, user!)
    // }
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
