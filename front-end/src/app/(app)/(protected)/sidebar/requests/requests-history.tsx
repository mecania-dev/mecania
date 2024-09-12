'use client'

import { LuTrash2 } from 'react-icons/lu'

import { SidebarRoute } from '@/components/sidebar/sidebar-route'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { confirmationModal } from '@/hooks/use-confirmation-modal'
import { useRequests } from '@/mocks/use-requests'
import { compareDesc, parseISO } from 'date-fns'

export function RequestsHistory() {
  // TODO: Remover depois que implementar o backend
  const { requests, removeRequest } = useRequests()
  const {} = useSWRCustom(null)
  const sortedReqs = requests.sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)))

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
      {sortedReqs.map((req, i) => (
        <SidebarRoute
          href={`/profile/mechanics/${req.mechanic.id}/requests/${req.id}`}
          variant="ghost"
          activeVariant="solid"
          classNames={{ text: 'truncate' }}
          endContent={
            req.status === 'pending' && (
              <LuTrash2
                className="hidden h-5 w-5 shrink-0 text-danger group-data-[active=true]:block group-data-[hover=true]:block hover:scale-105"
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
