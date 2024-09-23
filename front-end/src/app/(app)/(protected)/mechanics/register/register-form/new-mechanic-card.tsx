import { FaTrash } from 'react-icons/fa6'

import { MechanicCard } from '@/app/(app)/(protected)/mechanics/mechanic-card'
import { NewAddressModalButton } from '@/app/(app)/(protected)/profile/addresses/address-modal'
import { Button } from '@/components/button'
import { AddressCreateOutput } from '@/http/address/create'
import { MechanicCreateOutput } from '@/http/user/create-mechanic'
import { Divider } from '@nextui-org/react'

import { useRegisterMechanics } from './use-register-mechanics'

interface NewMechanicCardProps {
  index: number
  mechanic: MechanicCreateOutput
}

export function NewMechanicCard({ index, mechanic }: NewMechanicCardProps) {
  const { addAddress, removeMechanic, removeAddress } = useRegisterMechanics()

  async function onSubmit(address: AddressCreateOutput) {
    addAddress(index, address)
  }

  const handleRemoveMechanic = (mechanicIndex: number) => () => {
    removeMechanic(mechanicIndex)
  }

  const handleRemoveAddress = (mechanicIndex: number, addressIndex: number) => () => {
    removeAddress(mechanicIndex, addressIndex)
  }

  return (
    <MechanicCard
      mechanic={mechanic as any}
      classNames={{
        username: '!text-small',
        infosIcon: '!h-3 !w-3',
        infosText: '!text-small',
        ratingText: '!text-small'
      }}
      hideAvatar
    >
      <Divider />
      <div className="space-y-2">
        <h4 className="text-small font-medium">Endereços</h4>
        {mechanic.addresses.length > 0 ? (
          <ul>
            {mechanic.addresses.map((address, i) => (
              <li className="flex items-center before:mr-2 before:text-foreground before:content-['•']" key={i}>
                <p className="truncate text-xs">
                  {`${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}`}
                </p>
                <FaTrash
                  className="h-3 w-3 shrink-0 cursor-pointer hover:text-danger"
                  onClick={handleRemoveAddress(index, i)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">Nenhum endereço cadastrado</p>
        )}
        <div className="flex h-7 gap-2">
          <NewAddressModalButton size="sm" className="h-auto w-fit px-1.5 py-1" onSubmit={onSubmit}>
            Novo endereço
          </NewAddressModalButton>
          <Button color="danger" size="sm" className="h-auto w-fit px-1.5 py-1" onPress={handleRemoveMechanic(index)}>
            Remover oficina
          </Button>
        </div>
      </div>
    </MechanicCard>
  )
}
