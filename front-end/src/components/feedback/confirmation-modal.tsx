'use client'

import { useConfirmationModal } from '@/hooks/use-confirmation-modal'
import { MaybePromise, maybePromise } from '@/lib/promise'
import { Button } from '@nextui-org/react'

import { Modal } from '../modal'

export function ConfirmationModal() {
  const { question, onConfirm, onCancel, isLoading, setIsLoading, confirmationModal, ...rest } = useConfirmationModal()

  const handleAction = (action?: MaybePromise<() => void>, setLoading?: boolean) => async () => {
    setLoading && setIsLoading(true)
    await maybePromise(action)
    setLoading && setIsLoading(false)
    confirmationModal.close()
  }

  return (
    <Modal onClose={handleAction(onCancel)} fullScreen={false} {...rest}>
      <Modal.Body>
        <p>{question}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={handleAction(onCancel)}>Cancelar</Button>
        <Button onPress={handleAction(onConfirm, true)} color="primary" isLoading={isLoading}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
