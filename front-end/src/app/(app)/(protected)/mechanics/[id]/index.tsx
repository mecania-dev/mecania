'use client'

import { Card } from '@/components/card'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { Mechanic } from '@/types/entities/mechanic'
import { cn } from '@nextui-org/react'

import { MechanicCard } from '../mechanic-card'

interface MechanicDetailsProps {
  id: Number
}

export function MechanicDetails({ id }: MechanicDetailsProps) {
  const { state } = useSWRCustom<Mechanic>(`users/${id}`)
  const mechanic = state.data

  if (!mechanic && !state.isLoading) return null

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
          {mechanic?.services && mechanic.services.length > 0 && (
            <Card className="w-full max-w-3xl sm:p-4" shadow="lg" isHoverable={false}>
              <Card.Header className="pb-0 text-large font-bold sm:text-xl">Serviços Oferecidos</Card.Header>
              <Card.Body>
                {mechanic.services.map((service, i) => (
                  <div key={service.id} className={cn(i !== mechanic.services.length - 1 && 'mb-2 border-b pb-2')}>
                    <h3 className="text-large font-medium">{service.name}</h3>
                    {service.description && <p className="text-default-600 max-sm:text-small">{service.description}</p>}
                    <p className="text-xs text-default-500 sm:text-small">
                      Categoria: {service.category} | Tipo de Veículo: {service.vehicleType}
                    </p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
          {/* Address Section */}
          {mechanic?.addresses && mechanic.addresses.length > 0 && (
            <Card className="w-full max-w-3xl sm:p-4" shadow="lg" isHoverable={false}>
              <Card.Header className="pb-0 text-large font-bold sm:text-xl">Endereços</Card.Header>
              <Card.Body>
                {mechanic.addresses.map((address, i) => (
                  <div key={address.id} className={cn(i !== mechanic.addresses.length - 1 && 'mb-2 border-b pb-2')}>
                    <p className="text-small sm:text-large">{`${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}`}</p>
                    <p className="text-xs text-default-500 sm:text-small">
                      {address.zipCode}, {address.country}
                    </p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
