import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { useUser } from '@/providers/user-provider'
import { AddressCreate, addressCreateSchema } from '@/types/entities/address'
import { zodResolver } from '@hookform/resolvers/zod'

import { AddressModalBody } from './body'
import { AddressModalFooter } from './footer'

interface AddressModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(address: AddressCreate) => void>
}

export function AddressModal({ isOpen, setIsOpen, onSubmit }: AddressModalProps) {
  const { user } = useUser()
  const form = useForm<AddressCreate>({
    resolver: zodResolver(addressCreateSchema),
    defaultValues: { userId: user?.id, country: 'BR' }
  })

  async function handleOnSubmit(address: AddressCreate) {
    await maybePromise(onSubmit, address)
    setIsOpen(false)
  }

  return (
    <Modal title="Novo Endereço" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
      <AddressModalBody />
      <AddressModalFooter />
    </Modal>
  )
}

interface NewAddressModalButtonProps {
  onSubmit?: MaybePromise<(address: AddressCreate) => void>
}

export function NewAddressModalButton({ onSubmit }: NewAddressModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color="secondary" onPress={() => setIsOpen(true)}>
      Novo
      {isOpen && <AddressModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} />}
    </Button>
  )
}