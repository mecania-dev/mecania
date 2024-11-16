'use client'

import React from 'react'

import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { compareDates } from '@/lib/date'
import { useUser } from '@/providers/user-provider'
import { Request } from '@/types/entities/chat/request'
import { groupBy } from 'lodash'

import { EmptyHistory } from '../empty-history'

export function RequestsHistory() {
  const { isMechanic } = useUser()
  const requests = useSWRCustom<Request[]>('chat/requests/', {
    fetcherConfig: { params: { paginate: false, title__isnull: false } }
  })
  const sortedReqs = requests.state.data?.sort((a, b) => compareDates(a.updatedAt, b.updatedAt, 'desc'))
  const groupedReqs = groupBy(sortedReqs ?? [], req => (isMechanic ? req.driver.username : req.mechanic.username))

  return (
    <div className="flex w-0 flex-col space-y-3 overflow-hidden transition-width group-data-[requests=true]:w-full">
      <div className="space-y-1 overflow-auto scrollbar-hide">
        {sortedReqs?.length === 0 && (
          <EmptyHistory
            title="Você ainda não tem solicitações"
            description="Suas futuras solicitações aparecerão aqui"
          />
        )}
        {Object.entries(groupedReqs).map(([user, requests], i) => (
          <React.Fragment key={i}>
            <p
              data-is-first={i === 0}
              className="truncate text-small font-semibold text-primary data-[is-first=false]:!mt-3"
            >
              {user}
            </p>
            {requests.map((req, i) => (
              <SidebarRoute
                canProps={{ I: ['message_mechanic', 'message_user'], a: 'Chat' }}
                href={`/profile/requests/${req.id}`}
                variant="ghost"
                activeVariant="solid"
                classNames={{ text: 'truncate' }}
                key={`${i}-${req.id}`}
              >
                {req.title}
              </SidebarRoute>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
