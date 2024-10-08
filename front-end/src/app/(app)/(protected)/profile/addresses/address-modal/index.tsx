import { useState } from 'react'

import { Button, ButtonProps } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import {
  AddressCreateInput,
  AddressCreateOutput,
  addressCreateSchema,
  AddressUpdateOutput,
  addressUpdateSchema
} from '@/http'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { useUser } from '@/providers/user-provider'
import { Address } from '@/types/entities/user'
import { zodResolver } from '@hookform/resolvers/zod'

import { AddressModalBody } from './body'
import { AddressModalFooter } from './footer'

type AddressModalProps<T extends Address | undefined = undefined> = {
  address?: T
  userId?: number
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(address: T extends undefined ? AddressCreateOutput : AddressUpdateOutput) => void>
}

export function AddressModal<T extends Address | undefined = undefined>({
  address,
  userId,
  isOpen,
  setIsOpen,
  onSubmit
}: AddressModalProps<T>) {
  const { user } = useUser()
  const form = useForm<AddressCreateInput>({
    resolver: zodResolver(address ? addressUpdateSchema : addressCreateSchema),
    defaultValues: { userId: userId ?? user?.id, country: 'BR', ...address }
  })

  async function handleOnSubmit(address: T extends undefined ? AddressCreateOutput : AddressUpdateOutput) {
    await maybePromise(onSubmit, address)
    setIsOpen(false)
  }

  return (
    <Modal title="Endereço" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
      <AddressModalBody />
      <AddressModalFooter />
    </Modal>
  )
}

type NewAddressModalButtonProps<T extends Address | undefined = undefined> = Omit<
  ButtonProps,
  'ref' | 'onPress' | 'onSubmit'
> & {
  onSubmit?: MaybePromise<(address: AddressCreateOutput) => void>
  modalProps?: Omit<AddressModalProps<T>, 'isOpen' | 'setIsOpen' | 'onSubmit'>
}

export function NewAddressModalButton({
  children,
  color = 'secondary',
  onSubmit,
  modalProps,
  ...rest
}: NewAddressModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color={color} onPress={() => setIsOpen(true)} {...rest}>
      {children ?? 'Novo'}
      {isOpen && <AddressModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} {...modalProps} />}
    </Button>
  )
}
