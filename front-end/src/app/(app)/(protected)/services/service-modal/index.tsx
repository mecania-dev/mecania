import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { ServiceCreateInput, ServiceCreateOutput, serviceCreateSchema } from '@/http'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { zodResolver } from '@hookform/resolvers/zod'

import { CategoryModal } from '../category-modal'
import { useCategoryModal } from '../category-modal/use-category-modal'
import { ServiceModalBody } from './body'
import { ServiceModalFooter } from './footer'

interface ServiceModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(service: ServiceCreateOutput) => void>
}

export function ServiceModal({ isOpen, setIsOpen, onSubmit }: ServiceModalProps) {
  const categoryModal = useCategoryModal()
  const form = useForm<ServiceCreateInput>({ resolver: zodResolver(serviceCreateSchema) })

  async function handleOnSubmit(service: ServiceCreateOutput) {
    await maybePromise(onSubmit, service)
    setIsOpen(false)
  }

  return (
    <>
      <Modal title="Novo Serviço" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
        <ServiceModalBody />
        <ServiceModalFooter />
      </Modal>
      {categoryModal.isOpen && <CategoryModal />}
    </>
  )
}

interface NewServiceModalButtonProps {
  onSubmit?: MaybePromise<(service: ServiceCreateOutput) => void>
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
