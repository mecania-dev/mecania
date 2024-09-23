import { useState } from 'react'

import { Button, ButtonProps } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { AddressCreateInput, AddressCreateOutput, addressCreateSchema } from '@/http/address/create'
import { AddressUpdateOutput, addressUpdateSchema } from '@/http/address/update'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { useUser } from '@/providers/user-provider'
import { Address } from '@/types/entities/address'
import { zodResolver } from '@hookform/resolvers/zod'

import { AddressModalBody } from './body'
import { AddressModalFooter } from './footer'

type AddressModalProps<T extends Address | undefined = undefined> = {
  address?: T
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(address: T extends undefined ? AddressCreateOutput : AddressUpdateOutput) => void>
}

export function AddressModal<T extends Address | undefined = undefined>({
  address,
  isOpen,
  setIsOpen,
  onSubmit
}: AddressModalProps<T>) {
  const { user } = useUser()
  const form = useForm<AddressCreateInput>({
    resolver: zodResolver(address ? addressUpdateSchema : addressCreateSchema),
    defaultValues: { userId: user?.id, country: 'BR', ...address }
  })

  async function handleOnSubmit(address: T extends undefined ? AddressCreateOutput : AddressUpdateOutput) {
    await maybePromise(onSubmit, address)
    setIsOpen(false)
  }

  return (
    <Modal title="Modal de Endereço" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
      <AddressModalBody />
      <AddressModalFooter />
    </Modal>
  )
}

interface NewAddressModalButtonProps extends Omit<ButtonProps, 'ref' | 'children' | 'onPress' | 'onSubmit'> {
  onSubmit?: MaybePromise<(address: AddressCreateOutput) => void>
}

export function NewAddressModalButton({ color = 'secondary', onSubmit, ...rest }: NewAddressModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color={color} onPress={() => setIsOpen(true)} {...rest}>
      Novo
      {isOpen && <AddressModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} />}
    </Button>
  )
}
