import { useState } from 'react'

import { Button, ButtonProps } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { VehicleCreateInput, VehicleCreateOutput, vehicleCreateSchema } from '@/http'
import { VehicleUpdateOutput, vehicleUpdateSchema } from '@/http/user/vehicle/update'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { Vehicle } from '@/types/entities/vehicle'
import { zodResolver } from '@hookform/resolvers/zod'

import { VehicleModalBody } from './vehicle-body'
import { VehicleModalFooter } from './vehicle-footer'

interface VehicleModalProps<T extends Vehicle | undefined = undefined> {
  vehicle?: T
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(vehicle: T extends undefined ? VehicleCreateOutput : VehicleUpdateOutput) => void>
}

export function VehicleModal<T extends Vehicle | undefined = undefined>({
  vehicle,
  isOpen,
  setIsOpen,
  onSubmit
}: VehicleModalProps<T>) {
  const form = useForm<VehicleCreateInput>({
    resolver: zodResolver(vehicle ? vehicleUpdateSchema : vehicleCreateSchema),
    defaultValues: vehicle
  })

  async function handleOnSubmit(vehicle: T extends undefined ? VehicleCreateOutput : VehicleUpdateOutput) {
    await maybePromise(onSubmit, vehicle)
    setIsOpen(false)
  }

  return (
    <Modal title="Novo Veículo" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={handleOnSubmit}>
      <VehicleModalBody />
      <VehicleModalFooter />
    </Modal>
  )
}

interface NewVehicleModalButtonProps extends Omit<ButtonProps, 'ref' | 'onPress' | 'onSubmit'> {
  onSubmit?: MaybePromise<(vehicle: VehicleCreateOutput) => void>
}

export function NewVehicleModalButton({
  children,
  color = 'secondary',
  onSubmit,
  ...rest
}: NewVehicleModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color={color} onPress={() => setIsOpen(true)} {...rest}>
      {children ?? 'Novo'}
      {isOpen && <VehicleModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} />}
    </Button>
  )
}
