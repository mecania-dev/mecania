import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { ServiceCreate, serviceCreateSchema } from '@/types/entities/service'
import { zodResolver } from '@hookform/resolvers/zod'

import { ServiceModalBody } from './body'
import { ServiceModalFooter } from './footer'

interface ServiceModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(service: ServiceCreate) => void>
}

export function ServiceModal({ isOpen, setIsOpen, onSubmit }: ServiceModalProps) {
  const form = useForm<ServiceCreate>({ resolver: zodResolver(serviceCreateSchema) })

  async function handleOnSubmit(service: ServiceCreate) {
    await maybePromise(onSubmit, service)
    setIsOpen(false)
  }

  return (
    <Modal title="Novo Serviço" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
      <ServiceModalBody />
      <ServiceModalFooter />
    </Modal>
  )
}

interface NewServiceModalButtonProps {
  onSubmit?: MaybePromise<(service: ServiceCreate) => void>
}

export function NewServiceModalButton({ onSubmit }: NewServiceModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color="secondary" onPress={() => setIsOpen(true)}>
      Novo
      {isOpen && <ServiceModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} />}
    </Button>
  )
}
