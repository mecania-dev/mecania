'use client'

import { useState } from 'react'
import { FaTrash } from 'react-icons/fa6'

import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { confirmationModal } from '@/components/modal'
import { Select } from '@/components/select'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { toast } from '@/hooks/use-toast'
import { AddressCreateOutput, addServices, createAddress, deleteAddress, deleteService } from '@/http'
import { useUser } from '@/providers/user-provider'
import { Service } from '@/types/entities/service'
import { Address, User } from '@/types/entities/user'
import { cn, Selection } from '@nextui-org/react'
import { mutate } from 'swr'

import { NewAddressModalButton } from '../../profile/addresses/address-modal'
import { MechanicCard } from '../mechanic-card'

interface MechanicDetailsProps {
  id: number
}

export function MechanicDetails({ id }: MechanicDetailsProps) {
  const { isAdmin } = useUser()
  const { state } = useSWRCustom<User>(`users/${id}`)
  const [selectedServices, setSelectedServices] = useState<Selection>(new Set([]))
  const mechanic = state.data

  if (!mechanic && !state.isLoading) return null

  async function onAddServices() {
    if (typeof selectedServices === 'string' || selectedServices.size === 0) return

    await addServices(id, Array.from(selectedServices.values()).map(Number), {
      onSuccess() {
        toast({ message: 'Serviços adicionados com sucesso', type: 'success' })
        mutate(`users/${id}`)
      },
      onError() {
        toast({ message: 'Erro ao adicionar serviços', type: 'error' })
      }
    })

    setSelectedServices(new Set([]))
  }

  async function onDeleteService(service: Service) {
    confirmationModal({
      size: 'sm',
      title: 'Remover serviço',
      question: `Tem certeza que deseja remover o serviço ${service.name}?`,
      async onConfirm() {
        const res = await deleteService(id, service.id)
        if (res.ok) {
          toast({ message: 'Serviço deletado com sucesso', type: 'success' })
          mutate(`users/${id}`)
        } else {
          toast({ message: 'Erro ao remover serviço', type: 'error' })
        }
      }
    })
  }

  async function onCreateAddress(address: AddressCreateOutput) {
    await createAddress(address, {
      onSuccess() {
        toast({ message: 'Endereço adicionado com sucesso', type: 'success' })
        mutate(`users/${id}`)
      },
      onError() {
        toast({ message: 'Erro ao adicionar endereço', type: 'error' })
      }
    })
  }

  function onDeleteAddress(address: Address) {
    confirmationModal({
      size: 'sm',
      title: 'Remover endereço',
      question: `Tem certeza que deseja remover o endereço ${address.street}, ${address.number} - ${address.district}?`,
      async onConfirm() {
        const res = await deleteAddress(id, address.id)
        if (res.ok) {
          toast({ message: 'Endereço deletado com sucesso', type: 'success' })
          mutate(`users/${id}`)
        } else {
          toast({ message: 'Erro ao remover endereço', type: 'error' })
        }
      }
    })
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-5">
      {/* Profile Section */}
      <MechanicCard
        mechanic={mechanic}
        classNames={{ base: 'sm:p-4', avatar: 'sm:h-20 sm:w-20', username: 'sm:text-2xl' }}
        isHoverable={false}
        isLoaded={!state.isLoading}
      />
      {!state.isLoading && (
        <>
          {/* Services Section */}
          {((mechanic?.services && mechanic.services.length > 0) || isAdmin) && (
            <Card className="w-full max-w-3xl sm:p-4" shadow="lg" isHoverable={false}>
              <Card.Header className="pb-0 text-large font-bold sm:text-xl">Serviços Oferecidos</Card.Header>
              <Card.Body>
                {mechanic?.services.map((service, i) => (
                  <div key={service.id} className={cn(i !== mechanic.services.length - 1 && 'mb-2 border-b pb-2')}>
                    <div className="flex justify-between gap-2">
                      <h3 className="text-large font-medium">{service.name}</h3>
                      {isAdmin && (
                        <Button
                          color="danger"
                          variant="ghost"
                          className="h-8 w-8 min-w-0 shrink-0"
                          isIconOnly
                          onPress={() => onDeleteService(service)}
                        >
                          <FaTrash className="shrink-0" />
                        </Button>
                      )}
                    </div>
                    {service.description && <p className="text-default-600 max-sm:text-small">{service.description}</p>}
                    <p className="text-xs text-default-500 sm:text-small">
                      Categoria: {service.category.name} | Tipo de Veículo: {service.vehicleType}
                    </p>
                  </div>
                ))}
              </Card.Body>
              {isAdmin && (
                <Card.Footer className="justify-end gap-4">
                  <ServicesSelect selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
                  <Button color="secondary" onPress={onAddServices}>
                    Adicionar
                  </Button>
                </Card.Footer>
              )}
            </Card>
          )}
          {/* Address Section */}
          {((mechanic?.addresses && mechanic.addresses.length > 0) || isAdmin) && (
            <Card className="w-full max-w-3xl sm:p-4" shadow="lg" isHoverable={false}>
              <Card.Header className="pb-0 text-large font-bold sm:text-xl">Endereços</Card.Header>
              <Card.Body>
                {mechanic?.addresses.map((address, i) => (
                  <div key={address.id} className={cn(i !== mechanic.addresses.length - 1 && 'mb-2 border-b pb-2')}>
                    <div className="flex justify-between gap-2">
                      <p className="text-small sm:text-large">{`${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}`}</p>
                      {isAdmin && (
                        <Button
                          color="danger"
                          variant="ghost"
                          className="h-8 w-8 min-w-0 shrink-0"
                          isIconOnly
                          onPress={() => onDeleteAddress(address)}
                        >
                          <FaTrash className="shrink-0" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-default-500 sm:text-small">
                      {address.zipCode}, {address.country}
                    </p>
                  </div>
                ))}
              </Card.Body>
              {isAdmin && (
                <Card.Footer className="justify-end">
                  <NewAddressModalButton modalProps={{ userId: id }} onSubmit={onCreateAddress} />
                </Card.Footer>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}

interface ServicesSelectProps {
  selectedServices: Selection
  setSelectedServices: React.Dispatch<React.SetStateAction<Selection>>
}

function ServicesSelect({ selectedServices, setSelectedServices }: ServicesSelectProps) {
  const { state } = useSWRCustom<Service[]>(`services/`, { fetcherConfig: { params: { paginate: false } } })
  const services = state.data ?? []

  return (
    <Select
      variant="faded"
      selectionMode="multiple"
      items={services}
      valueKey="id"
      labelKey="name"
      selectedKeys={selectedServices}
      onSelectionChange={setSelectedServices}
      className="w-60 max-w-full"
      isLoading={state.isLoading}
    />
  )
}
