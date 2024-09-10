import { Image } from '@/components/image'
import { Rating } from '@/components/rating'
import { useRequests } from '@/mocks/use-requests'
import { Checkbox } from '@nextui-org/react'

import { MechanicWithDistance } from '.'
import { useRecommendations } from './use-recommendations'

export function MechanicRecommendation(mechanic: MechanicWithDistance) {
  const recs = useRecommendations()
  const { getRequest } = useRequests()
  const request = getRequest(recs.chat, mechanic)
  const initials = mechanic.firstName
    .split(' ')
    .map(name => name[0])
    .join('')

  return (
    <div className="flex flex-col">
      <Checkbox
        value={String(mechanic.id)}
        aria-label={mechanic.firstName}
        classNames={{
          base: [
            'flex w-full max-w-none bg-gradient-to-tr from-primary/20 via-[#CDCDCD]/20 to-secondary/20',
            'cursor-pointer rounded-large gap-2 p-3',
            'border-0 border-transparent m-[2px]',
            'data-[selected=true]:m-0 data-[selected=true]:border-2 data-[selected=true]:border-primary'
          ],
          label: 'flex h-full w-full overflow-hidden'
        }}
        isDisabled={request !== undefined}
      >
        <Image
          src={mechanic.avatarUrl ?? `https://placehold.co/100/png?text=${initials}&font=roboto`}
          alt="logo"
          classNames={{ wrapper: 'h-full aspect-square mr-3', img: 'object-cover' }}
          fill
        />
        <div className="grow overflow-hidden">
          <p className="truncate whitespace-nowrap font-semibold">{mechanic.firstName}</p>
          <p className="truncate whitespace-nowrap">{`${mechanic.addresses[0].city}, ${mechanic.addresses[0].neighborhood}`}</p>
          <Rating rating={mechanic.rating ?? 0} hideLabel />
          <p className="truncate whitespace-nowrap">{mechanic.distance} km</p>
        </div>
      </Checkbox>
      {request !== undefined && (
        <p className="text-small text-default-500">
          {request.status === 'accepted' ? 'Solicitação aceita' : 'Solicitação já enviada'}
        </p>
      )}
    </div>
  )
}
