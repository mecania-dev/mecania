import { useState } from 'react'

import { Button } from '@/components/button'
import { toast } from '@/hooks/use-toast'
import { createVehicle, VehicleCreateOutput } from '@/http'
import { useUser } from '@/providers/user-provider'
import { mutate } from 'swr'

import { VehicleModal } from '../profile/vehicles/vehicle-modal'
import { useChat } from './use-chat'

export function VehicleSelector() {
  const { user } = useUser()
  const { chat, vehicle, setVehicle } = useChat()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          <Button
            data-selected={vehicle?.id === v.id}
            className="group relative overflow-hidden bg-transparent p-0 data-[selected=true]:p-1"
            onPress={!chat ? () => setVehicle(v) : undefined}
            key={v.id}
          >
            <div className="absolute -inset-x-1 top-1/2 -z-[2] aspect-square -translate-y-1/2 group-data-[selected=false]:hidden">
              <div className="h-full w-full animate-[spin_4s_linear_infinite] bg-gradient-to-r from-danger via-secondary to-info"></div>
            </div>
            <div className="-z-[1] flex h-full items-center justify-center bg-primary px-1.5 font-semibold group-data-[selected=true]:rounded-[8px]">
              {v.brand} {v.model} - {v.year}
            </div>
          </Button>
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
