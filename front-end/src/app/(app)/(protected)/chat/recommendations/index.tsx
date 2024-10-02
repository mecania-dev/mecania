import { useEffect, useState } from 'react'

import Loading from '@/app/loading'
import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { search } from '@/lib/string'
import { User } from '@/types/entities/user'
import { CheckboxGroup, ScrollShadow } from '@nextui-org/react'
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
  const mechanics = useSWRCustom<User[]>('users/mechanics/', {
    onSuccess: recs.setMechanics,
    fetcherConfig: { params: { paginate: false } }
  })
  const [filteredMechanics, setFilteredMechanics] = useState<MechanicWithDistance[]>([])
  const searchedMechanics = search(filteredMechanics, 'firstName', recs.searchQuery)

  useEffect(() => {
    if (!mechanics.state.isLoading) {
      setFilteredMechanics(applyFilters(recs.mechanics, recs.filters))
    }
  }, [mechanics.state.isLoading, recs.filters, recs.mechanics])

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
        {/* Loading */}
        {mechanics.state.isLoading ? (
          <div className="flex grow items-center justify-center">
            <Loading />
          </div>
        ) : // Loaded but no mechanics
        searchedMechanics.length === 0 ? (
          <div className="flex grow items-center justify-center p-6">
            <p className="text-center text-default-400">Nenhuma oficina recomendada</p>
          </div>
        ) : (
          // Loaded and mechanics found
          <>
            <p className="px-6 pb-1 text-center text-small text-foreground-500 sm:text-medium">
              Selecione as oficinas que deseja enviar mensagem
            </p>
            <ScrollShadow className="px-6">
              <CheckboxGroup
                value={recs.selectedMechanics.map(m => String(m.id))}
                onChange={recs.setSelectedMechanics}
                classNames={{ wrapper: 'grid grid-cols-1 gap-3 md:grid-cols-2' }}
              >
                {searchedMechanics.map(mechanic => (
                  <MechanicRecommendation key={mechanic.id} {...mechanic} />
                ))}
              </CheckboxGroup>
            </ScrollShadow>
            <div className="flex justify-end p-4 pt-3">
              <Button isDisabled={recs.selectedMechanics.length === 0} onPress={recs.openSendModal}>
                Enviar
                <SendMessageModal />
              </Button>
            </div>
          </>
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
    const { rating, addresses } = current

    if (!addresses) return acc

    // Filter by rating
    if (rating < ratings.min || rating > ratings.max) {
      return acc
    }

    // Filter by cities
    const mechanicCities = map(addresses, 'city')
    if (!intersection(mechanicCities, cities).length) {
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
