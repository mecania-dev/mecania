import { useEffect, useState } from 'react'

import Loading from '@/app/loading'
import { AsyncScroll } from '@/components/async-scroll'
import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { useLocation } from '@/hooks/use-location'
import { PaginationState } from '@/hooks/use-pagination'
import { api } from '@/http'
import { search } from '@/lib/string'
import { Request } from '@/types/entities/chat/request'
import { User } from '@/types/entities/user'
import { CheckboxGroup } from '@nextui-org/react'
import { intersection, map } from 'lodash'

import { ChatStore, useChat } from '../use-chat'
import { ChatRecommendationsFilters } from './filters'
import { MechanicRecommendation } from './mechanic'
import { SendMessageModal } from './send-message-modal'

export function ChatRecommendations() {
  const { chat, recommendations: recs, summary, setSummary, setMechanicsWithRequest } = useChat()
  const [mechanicsState, setMechanicsState] = useState<PaginationState<User>>()
  const searchedMechanics = search(applyFilters(recs.mechanics, recs.filters), 'firstName', recs.searchQuery, false)
  const location = useLocation()
  const requests = useSWRCustom<Request[]>(recs.mechanics.length ? 'chat/requests/' : null, {
    fetcherConfig: { params: { chat_group__id: chat?.id, mechanic__id__in: recs.mechanics.map(m => m.id).join(',') } }
  })

  useEffect(() => {
    if (requests.state.data) {
      setMechanicsWithRequest(requests.state.data.map(r => r.mechanic.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests.state.data])

  useEffect(() => {
    if (mechanicsState?.items.length) {
      recs.setMechanics(mechanicsState.items)
    }

    if (!summary) {
      api.get<{ message: string }>(`chat/${chat?.id}/summary/`, {
        onSuccess(res) {
          if (res.data.message) {
            setSummary(res.data.message)
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mechanicsState?.items])

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
        {!mechanicsState?.isMounted && <Loading isFixed={false} />}
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
              services__isnull: false,
              services__id__in: chat?.issues.flatMap(issue => issue.recommendations.map(r => r.service)).join(','),
              addresses__city__in: recs.filters.cities.reduce((acc, city) => (acc += city + ','), ''),
              received_ratings__score__avg: `${recs.filters.ratings.min},${recs.filters.ratings.max}`,
              ...(location.lat !== undefined &&
                recs.filters.distance && {
                  lat: location.lat,
                  lon: location.lon,
                  distance_min: recs.filters.distance.min,
                  distance_max: recs.filters.distance.max
                })
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
                  <MechanicRecommendation
                    distance={`${recs.filters.distance.min} - ${recs.filters.distance.max}`}
                    key={mechanic.id}
                    {...mechanic}
                  />
                ))}
              </CheckboxGroup>
            )
          }}
        </AsyncScroll>
        {!!mechanicsState?.items.length && (
          <div className="flex justify-end p-4 pt-3">
            <Button isDisabled={recs.selectedMechanics.length === 0 || !summary} onPress={recs.openSendModal}>
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

    acc.push({ ...current })

    return acc
  }, [] as User[])
}
