'use client'

import { ChatInput } from '@/components/chat/input'
import { Form } from '@/components/form'
import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { useForm } from '@/hooks/use-form'
import { ReadyState, useWebSocket } from '@/hooks/use-web-socket'
import { createChat } from '@/http'
import { useUser } from '@/providers/user-provider'
import { Message, SendMessage, sendMessageSchema } from '@/types/entities/chat'
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
  const {
    chat,
    vehicle,
    initialQuestions,
    firstMessage,
    isAiGenerating,
    sendMessage,
    setChat,
    getCurrentQuestion,
    answerQuestion,
    setIsAiGenerating,
    setFirstMessage
  } = useChat()
  const { currentQuestion, index: questionIndex, isLastQuestion } = getCurrentQuestion()
  const form = useForm<SendMessage>({ resolver: zodResolver(sendMessageSchema), defaultValues: { message: '' } })
  const { isSubmitting, isValid } = form.formState
  const socket = useWebSocket<Message & { isAiGenerating: boolean }>(
    chat?.groupName ? `/ws/chat/${chat.groupName}/` : null,
    {
      onOpen,
      onMessage
    }
  )

  const hasRecommendations = !!chat?.issues.some(issue => issue.recommendations.length > 0)
  const isChatDisabled = (!chat && currentQuestion?.type === 'options') || !vehicle
  const isDisabled =
    (chat && socket.readyState !== ReadyState.OPEN) || isSubmitting || !isValid || isChatDisabled || isAiGenerating

  useFirstRenderEffect(() => {
    form.setFocus('message')
  })

  function onOpen() {
    if (!firstMessage) return
    setIsAiGenerating(true)
    socket.sendJsonMessage({ message: firstMessage })
    setFirstMessage('')
  }

  function onMessage(e: MessageEvent<any>) {
    if (!chat) return

    const data = JSON.parse(e.data)
    sendMessage(data)

    if (data.sender.id !== user?.id) {
      mutate(`/chat/${chat.id}`).then(() => {
        setIsAiGenerating(false)
      })
    }
  }

  async function onSubmit({ message }: SendMessage) {
    form.reset()

    if (!chat && currentQuestion) {
      answerQuestion(questionIndex, { ...currentQuestion, answer: message })

      if (isLastQuestion) {
        message = ''
        message += `Resumo do problema:\n\n`
        message += `Qual veículo está com problemas?\n${vehicle?.brand} ${vehicle?.model} - ${vehicle?.year}\n\n`

        initialQuestions.forEach(q => {
          message += setInitialMessage(q)
        })

        setFirstMessage(message)

        const res = await createChat({ vehicle: vehicle!.id, isPrivate: true })
        if (res.ok) {
          router.replace(`/chat/${res.data.id}`)
          setChat(res.data)
          setCookie('createdChatId', res.data.id)
          mutate('chat/')
        }
      }

      return
    }

    setIsAiGenerating(true)
    socket.sendJsonMessage({ message })
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
