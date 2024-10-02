import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { TextArea } from '@/components/textarea'
import { useIsLoading } from '@/hooks/use-is-loading'
import { toast } from '@/hooks/use-toast'
import { delay } from '@/lib/promise'
import { useRequests } from '@/mocks/use-requests'
import { useUser } from '@/providers/user-provider'
import confetti from 'canvas-confetti'

import { useChat } from '../use-chat'

export function SendMessageModal() {
  const { user } = useUser()
  const { chat, recommendations: recs } = useChat()
  const { sendRequest } = useRequests()
  const defaultMessage = `Estou com um problema no meu carro: há um barulho metálico ao acelerar, além de perda de potência e aumento no consumo de combustível. Acredito que possa estar relacionado ao sistema de exaustão ou ao motor. Poderia analisar isso para mim?\n\nAguardo seu retorno.\n\nObrigado,\n${user?.firstName}`
  const [message, setMessage] = useState(defaultMessage)

  const [sendMessage, isSending] = useIsLoading(async () => {
    for (const mechanic of recs.selectedMechanics) {
      await delay(0.25)
      sendRequest({
        chat: chat!,
        driver: user!,
        mechanic,
        message: getGreeting(mechanic.firstName ?? mechanic.username) + message
      })
    }
  })

  function resetMessage() {
    setMessage(defaultMessage)
  }

  async function onSend() {
    await sendMessage()

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
          label={getGreeting('{Nome do mecânico}')}
          labelPlacement="outside"
          value={message}
          onValueChange={setMessage}
          description="Sinta-se à vontade para editar a mensagem antes de enviar"
          maxRows={25}
        />
      </Modal.Body>
      <Modal.Footer className="p-2 pt-0">
        <Button color="secondary" onPress={resetMessage} isDisabled={message === defaultMessage || isSending}>
          Resetar
        </Button>
        <Button onPress={onSend} isLoading={isSending}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function getGreeting(mechanicName: string) {
  return `Olá, ${mechanicName}!\n\n`
}
