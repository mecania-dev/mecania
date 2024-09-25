'use client'

import { LuTrash2 } from 'react-icons/lu'

import { confirmationModal } from '@/components/modal'
import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { compareDates } from '@/lib/date'
import { useRequests } from '@/mocks/use-requests'

import { EmptyHistory } from '../empty-history'

export function RequestsHistory() {
  // TODO: Remover depois que implementar o backend
  const { requests, removeRequest } = useRequests()
  const {} = useSWRCustom(null)
  const sortedReqs = requests.sort((a, b) => compareDates(a.updatedAt, b.updatedAt, 'desc'))

  const handleChatRemove = (requestId?: number) => (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()

    confirmationModal({
      size: 'sm',
      title: 'Excluir solicitação',
      question: 'Tem certeza que deseja excluir essa solicitação?',
      onConfirm: () => removeRequest(requestId)
    })
  }

  return (
    <div className="w-0 space-y-1 overflow-hidden transition-width group-data-[requests=true]:w-full">
      {sortedReqs.length === 0 && (
        <EmptyHistory title="Você ainda não tem solicitações" description="Suas futuras solicitações aparecerão aqui" />
      )}
      {sortedReqs.map((req, i) => (
        <SidebarRoute
          href={`/profile/requests/${req.id}`}
          variant="ghost"
          activeVariant="solid"
          classNames={{ text: 'truncate' }}
          endContent={
            req.status === 'pending' && (
              <LuTrash2
                className="hidden h-5 w-5 shrink-0 text-danger hover:scale-105 group-data-[active=true]:block group-data-[hover=true]:block"
                onClick={handleChatRemove(req.id)}
              />
            )
          }
          key={`${i}-${req.id}`}
        >
          {`${req.mechanic.firstName} - ${req.chat.title}`}
        </SidebarRoute>
      ))}
    </div>
  )
}
