import { useEffect, useState } from 'react'

import Loading from '@/app/loading'
import { AsyncScroll } from '@/components/async-scroll'
import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { PaginationState } from '@/hooks/use-pagination'
import { search } from '@/lib/string'
import { User } from '@/types/entities/user'
import { CheckboxGroup } from '@nextui-org/react'
import { intersection, map, random } from 'lodash'

import { ChatStore, useChat } from '../use-chat'
import { ChatRecommendationsFilters } from './filters'
import { MechanicRecommendation } from './mechanic'
import { SendMessageModal } from './send-message-modal'

export interface MechanicWithDistance extends User {
  distance: number
}

export function ChatRecommendations() {
  const { recommendations: recs } = useChat()
  const [mechanicsState, setMechanicsState] = useState<PaginationState<User>>()
  const [filteredMechanics, setFilteredMechanics] = useState<MechanicWithDistance[]>([])
  const searchedMechanics = search(filteredMechanics, 'firstName', recs.searchQuery, false)

  useEffect(() => {
    if (mechanicsState?.items.length) {
      recs.setMechanics(mechanicsState.items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mechanicsState?.items])

  // TODO: As soon as the distance feature is implemented, this will be removed
  useEffect(() => {
    if (recs.mechanics.length) {
      setFilteredMechanics(applyFilters(recs.mechanics, recs.filters))
    }
  }, [recs.filters, recs.mechanics])

  return (
    <Modal
      title="Oficinas"
      size="5xl"
      isOpen={recs.isModalOpen}
      onOpenChange={recs.setIsModalOpen}
      className="sm:h-[40rem]"
      isDismissable={!recs.isSendOpen}
      isKeyboardDismissDisabled={recs.isSendOpen}
    >
      <Modal.Body className="relative gap-0 overflow-hidden p-0">
        <ChatRecommendationsFilters className="pb-3" />
        {!mechanicsState?.isMounted && <Loading isAbsolute={false} />}
        {mechanicsState?.isMounted && !mechanicsState.items.length && (
          <div className="flex grow items-center justify-center p-6">
            <p className="text-center text-default-400">Nenhuma oficina recomendada</p>
          </div>
        )}
        {!!mechanicsState?.items.length && (
          <p className="px-6 pb-1 text-center text-small text-foreground-500 sm:text-medium">
            Selecione as oficinas que deseja enviar mensagem
          </p>
        )}
        <AsyncScroll<User>
          url="users/mechanics/"
          config={{
            params: {
              addresses__city__in: recs.filters.cities.reduce((acc, city) => (acc += city + ','), ''),
              received_ratings__score__avg: `${recs.filters.ratings.min},${recs.filters.ratings.max}`
            }
          }}
          data-mounted={mechanicsState?.isMounted}
          onStateChange={setMechanicsState}
          className="px-6 data-[mounted=true]:grow"
        >
          {(mechanics, { isMounted }) => {
            if (!isMounted || !mechanics?.length) return null

            return (
              <CheckboxGroup
                value={recs.selectedMechanics.map(m => String(m.id))}
                onChange={recs.setSelectedMechanics}
                classNames={{ wrapper: 'grid grid-cols-1 gap-3 md:grid-cols-2' }}
              >
                {searchedMechanics.map(mechanic => (
                  <MechanicRecommendation key={mechanic.id} {...mechanic} />
                ))}
              </CheckboxGroup>
            )
          }}
        </AsyncScroll>
        {!!mechanicsState?.items.length && (
          <div className="flex justify-end p-4 pt-3">
            <Button isDisabled={recs.selectedMechanics.length === 0} onPress={recs.openSendModal}>
              Enviar
              <SendMessageModal />
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

function applyFilters(
  mechanics: ChatStore['recommendations']['mechanics'],
  filters: ChatStore['recommendations']['filters']
) {
  const { ratings, cities } = filters

  return mechanics.reduce((acc, current) => {
    if (!current.rating) current.rating = 0
    const { firstName, rating, addresses } = current

    if (!firstName || !addresses.length) return acc

    // Filter by rating
    if (rating < ratings.min || rating > ratings.max) {
      return acc
    }

    // Filter by cities
    const mechanicCities = map(addresses, 'city')
    if (cities.length && !intersection(mechanicCities, cities).length) {
      return acc
    }

    // Filter by distance
    // TODO: Replace this with the real distance calculation
    const distance = random(1, 10)

    if (distance > filters.distance.max || distance < filters.distance.min) {
      return acc
    }

    acc.push({ ...current, distance })

    return acc
  }, [] as MechanicWithDistance[])
}
