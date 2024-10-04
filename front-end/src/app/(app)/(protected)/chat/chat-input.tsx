'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { createChat } from '@/http'
import { useUser } from '@/providers/user-provider'
import { SendMessage, sendMessageSchema } from '@/types/entities/chat'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

import { useChat } from './use-chat'

export function AIChatInput() {
  const router = useRouter()
  const { user } = useUser()
  const { chat, vehicle, sendMessage, setChat, getCurrentQuestion, answerQuestion } = useChat()
  const [currentQuestion, questionIndex] = getCurrentQuestion()
  const form = useForm<SendMessage>({ resolver: zodResolver(sendMessageSchema), defaultValues: { message: '' } })
  const { isSubmitting, isValid } = form.formState

  const hasRecommendations = !!chat?.issues.some(issue => issue.recommendations.length > 0)
  const isChatDisabled = (!chat && currentQuestion?.type === 'options') || !vehicle
  const isDisabled = isSubmitting || !isValid || isChatDisabled

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  async function onSubmit({ message }: SendMessage) {
    if (currentQuestion) {
      answerQuestion(questionIndex, { ...currentQuestion, answer: message })
      form.reset()
      return
    }

    sendMessage(message, user!)
    form.reset()

    if (!chat && vehicle) {
      const res = await createChat({ vehicle: vehicle.id, isPrivate: true, message })
      if (res.ok) {
        router.replace(`/chat/${res.data.id}`)
        setChat(res.data)
        mutate('chat/')
      }
      return
    }
  }

  if (hasRecommendations) return null

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="mx-auto flex w-full px-5 pb-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
    >
      <ChatInput
        maxLength={1024}
        description={
          !chat && vehicle && currentQuestion?.type === 'text'
            ? 'Por favor, insira sua resposta para a pergunta acima.'
            : undefined
        }
        submitProps={{ isDisabled }}
        onSubmit={form.handleSubmit(onSubmit)}
        isDisabled={isChatDisabled}
        fullWidth
        {...form.register('message')}
      />
    </Form>
  )
}
