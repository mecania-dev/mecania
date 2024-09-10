import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useForm } from '@/hooks/use-form'
import { useVehicles } from '@/mocks/use-vehicles'
import { VehicleCreate, vehicleCreateSchema } from '@/types/entities/vehicle'
import { zodResolver } from '@hookform/resolvers/zod'
import { create } from 'zustand'

import { VehicleModalBody } from './vehicle-body'
import { VehicleModalFooter } from './vehicle-footer'

type VehicleModalStore = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export const useVehicleModal = create<VehicleModalStore>()(set => ({
  isOpen: false,
  setIsOpen: value => set({ isOpen: value })
}))

export function VehicleModal() {
  const { isOpen, setIsOpen } = useVehicleModal()
  const { addVehicle } = useVehicles()
  const form = useForm<VehicleCreate>({ resolver: zodResolver(vehicleCreateSchema) })

  async function onSubmit(vehicle: VehicleCreate) {
    addVehicle(vehicle)
    setIsOpen(false)
  }

  return (
    <Modal title="Novo Veículo" form={form} isOpen={isOpen} onOpenChange={setIsOpen} onFormSubmit={onSubmit}>
      <VehicleModalBody />
      <VehicleModalFooter />
    </Modal>
  )
}

export function NewVehicleModalButton() {
  const { isOpen, setIsOpen } = useVehicleModal()

  return (
    <Button color="secondary" onPress={() => setIsOpen(true)}>
      Novo
      {isOpen && <VehicleModal />}
    </Button>
  )
}
