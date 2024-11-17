import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { Rating } from '@/components/rating'
import { TextArea } from '@/components/textarea'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useIsLoading } from '@/hooks/use-is-loading'
import { useUser } from '@/providers/user-provider'

import { useRequest } from '../use-chat'

export function Feedbacks() {
  const { user, isMechanic } = useUser()
  const { request, setHasRatings, setHasAIRatings } = useRequest()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mechanicRating, setMechanicRating] = useState(0)
  const [mechanicFeedback, setMechanicFeedback] = useState('')
  const [AIRating, setAIRating] = useState(0)
  const [AIFeedback, setAIFeedback] = useState('')
  const isResolved = request?.mechanicStatus === 'resolved' && request?.driverStatus === 'resolved'

  const ratings = useSWRCustom<any[]>(isResolved && !isMechanic ? 'ratings/' : null, {
    fetcherConfig: { params: { paginate: false, mechanic__id: !isMechanic ? request?.mechanic.id : undefined } },
    onSuccess: data => setHasRatings(data.length > 0)
  })
  const hasRatings = ratings.state.data && ratings.state.data.length > 0
  const isMechanicFeedback = !isMechanic && !hasRatings

  const aiRatings = useSWRCustom<any[]>(isResolved ? 'ratings/ai/' : null, {
    fetcherConfig: { params: { paginate: false, user__id: user?.id, chat_group__id: request?.chatGroup } },
    onSuccess: data => {
      setHasAIRatings(data.length > 0)
      setIsModalOpen(data.length === 0)
    }
  })

  const [sendRating, isSending] = useIsLoading(async (type: 'mechanic' | 'ai') => {
    if (type === 'mechanic') {
      await ratings.post({
        mechanic: request?.mechanic.id,
        score: mechanicRating,
        feedback: mechanicFeedback
      })
    } else {
      const res = await aiRatings.post({
        user: user?.id,
        chatGroup: request?.chatGroup,
        score: AIRating,
        feedback: AIFeedback
      })
      if (res.ok) {
        setIsModalOpen(false)
      }
    }
  })

  if (!isResolved) return null

  return (
    <Modal
      title={isMechanicFeedback ? 'Como foi o atendimento da oficina?' : 'Como foi a resposta do chatbot?'}
      isOpen={isModalOpen}
      hideCloseButton
    >
      <Modal.Body>
        <Rating
          rating={isMechanicFeedback ? mechanicRating : AIRating}
          onRatingChange={isMechanicFeedback ? setMechanicRating : setAIRating}
        />
        <TextArea
          label="Feedback"
          value={isMechanicFeedback ? mechanicFeedback : AIFeedback}
          onValueChange={isMechanicFeedback ? setMechanicFeedback : setAIFeedback}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={() => sendRating(isMechanicFeedback ? 'mechanic' : 'ai')} isLoading={isSending}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
