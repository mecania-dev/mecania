'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { createChat } from '@/http'
import { useUser } from '@/providers/user-provider'
import { SendMessage, sendMessageSchema } from '@/types/entities/chat'
import { zodResolver } from '@hookform/resolvers/zod'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

import { Question, useChat } from './use-chat'

function setInitialMessage(question: Question) {
  let initialMessage = ''

  if (question.answer) {
    initialMessage += `${question.text}\n${question.answer}\n\n`
  }

  if (question.type === 'text' && typeof question.followUp === 'object') {
    initialMessage += setInitialMessage(question.followUp)
  }

  if (question.type === 'options') {
    question.options.forEach(option => {
      if (option.text === question.answer && typeof option.followUp === 'object') {
        initialMessage += setInitialMessage(option.followUp)
      }
    })
  }

  return initialMessage
}

interface AIChatInputProps {
  isLoading: boolean
}

export function AIChatInput({ isLoading }: AIChatInputProps) {
  const router = useRouter()
  const { user } = useUser()
  const { chat, vehicle, initialQuestions, sendMessage, setChat, getCurrentQuestion, answerQuestion } = useChat()
  const { currentQuestion, index: questionIndex, isLastQuestion } = getCurrentQuestion()
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

      if (isLastQuestion) {
        let initialMessage = ''
        initialMessage += `Resumo do problema:\n\n`
        initialMessage += `Qual veículo está com problemas?\n${vehicle?.brand} ${vehicle?.model} - ${vehicle?.year}\n\n`

        initialQuestions.forEach(q => {
          initialMessage += setInitialMessage(q)
        })

        sendMessage(initialMessage, user!)

        const res = await createChat({ vehicle: vehicle!.id, isPrivate: true, message: initialMessage })
        if (res.ok) {
          router.replace(`/chat/${res.data.id}`)
          setChat(res.data)
          setCookie('createdChatId', res.data.id)
          mutate('chat/')
        }
      }
      return
    }

    sendMessage(message, user!)
    form.reset()
  }

  if (hasRecommendations && !isLoading) return null

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
