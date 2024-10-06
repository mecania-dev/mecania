import { useState } from 'react'

import { Button, SelectableButton } from '@/components/button'
import { toast } from '@/hooks/use-toast'
import { createVehicle, VehicleCreateOutput } from '@/http'
import { useUser } from '@/providers/user-provider'
import { mutate } from 'swr'

import { VehicleModal } from '../profile/vehicles/vehicle-modal'
import { useChat } from './use-chat'

export function VehicleSelector() {
  const { user } = useUser()
  const { chat, vehicle, setVehicle, getCurrentQuestion } = useChat()
  const { isAllAnswered } = getCurrentQuestion()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (chat && !isAllAnswered) return null

  async function onCreateVehicle(vehicle: VehicleCreateOutput) {
    const res = await createVehicle(user!.id, vehicle)
    if (res.ok) {
      toast({ message: 'Veículo adicionado com sucesso', type: 'success' })
      mutate('users/me/')
    } else {
      toast({ message: 'Erro ao criar veículo', type: 'error' })
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-large font-semibold">Qual veículo está com problemas?</h2>
      <div className="flex flex-wrap gap-3">
        {user?.vehicles.map(v => (
          <SelectableButton
            isSelected={vehicle?.id === v.id}
            onPress={!chat ? () => setVehicle(v) : undefined}
            key={v.id}
          >
            {v.brand} {v.model} - {v.year}
          </SelectableButton>
        ))}
        {!chat && (
          <>
            <Button color="secondary" className="font-semibold" onClick={() => setIsModalOpen(true)}>
              Novo
            </Button>
            <VehicleModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onSubmit={onCreateVehicle} />
          </>
        )}
      </div>
    </div>
  )
}
