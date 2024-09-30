import { useState } from 'react'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { VehicleCreateInput, VehicleCreateOutput, vehicleCreateSchema } from '@/http'
import { maybePromise, MaybePromise } from '@/lib/promise'
import { zodResolver } from '@hookform/resolvers/zod'

import { VehicleModalBody } from './vehicle-body'
import { VehicleModalFooter } from './vehicle-footer'

interface VehicleModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: MaybePromise<(vehicle: VehicleCreateOutput) => void>
}

export function VehicleModal({ isOpen, setIsOpen, onSubmit }: VehicleModalProps) {
  const form = useForm<VehicleCreateInput>({ resolver: zodResolver(vehicleCreateSchema) })

  async function handleOnSubmit(vehicle: VehicleCreateOutput) {
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

interface NewVehicleModalButtonProps {
  onSubmit?: MaybePromise<(vehicle: VehicleCreateOutput) => void>
}

export function NewVehicleModalButton({ onSubmit }: NewVehicleModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button color="secondary" onPress={() => setIsOpen(true)}>
      Novo
      {isOpen && <VehicleModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} />}
    </Button>
  )
}
