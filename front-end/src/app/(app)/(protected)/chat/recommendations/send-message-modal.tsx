import { useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { TextArea } from '@/components/textarea'
import { useIsLoading } from '@/hooks/use-is-loading'
import { toast } from '@/hooks/use-toast'
import { createRequest } from '@/http'
import { useUser } from '@/providers/user-provider'
import confetti from 'canvas-confetti'
import { mutate } from 'swr'

import { useChat } from '../use-chat'

export function SendMessageModal() {
  const { user } = useUser()
  const { chat, recommendations: recs, summary } = useChat()
  const [message, setMessage] = useState(summary ?? '')

  const [sendMessage, isSending] = useIsLoading(async () => {
    let success = true
    for (const mechanic of recs.selectedMechanics) {
      await createRequest(
        {
          chatGroup: chat!.id,
          title: chat!.title,
          mechanic: mechanic.id,
          messages: [{ content: message, sender: user!.id }]
        },
        {
          onError() {
            success = false
          }
        }
      )
      await mutate('chat/requests/')
    }

    return success
  })

  useEffect(() => {
    setMessage(summary ?? '')
  }, [summary])

  function resetMessage() {
    setMessage(summary ?? '')
  }

  async function onSend() {
    const success = await sendMessage()

    if (!success) {
      toast({ message: 'Erro ao enviar solicitação', type: 'error' })
      return
    }

    confetti({
      particleCount: 100,
      spread: 50,
      origin: { x: 0.5, y: 1 }
    })
    toast({ message: 'Solicitação enviada com sucesso!', type: 'success' })
    recs.setIsModalOpen(false)
  }

  return (
    <Modal title="Mensagem" isOpen={recs.isSendOpen} onOpenChange={recs.setIsSendOpen} fullScreen={false}>
      <Modal.Body className="pt-0">
        <TextArea
          labelPlacement="outside"
          value={message}
          onValueChange={setMessage}
          description="Sinta-se à vontade para editar a mensagem antes de enviar"
          maxRows={25}
        />
      </Modal.Body>
      <Modal.Footer className="p-2 pt-0">
        <Button color="secondary" onPress={resetMessage} isDisabled={message === summary || isSending}>
          Resetar
        </Button>
        <Button onPress={onSend} isLoading={isSending}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
