import { Button } from '@/components/button'
import { useIsLoading } from '@/hooks/use-is-loading'
import { api } from '@/http'
import { useUser } from '@/providers/user-provider'
import { mutate } from 'swr'

import { useRequest } from '../use-chat'

interface UserActionsProps {
  isLoading: boolean
}

export function UserActions({ isLoading }: UserActionsProps) {
  const { isMechanic } = useUser()
  const { request } = useRequest()
  const [onAccept, isAccepting] = useIsLoading(async () => {
    await api.put(`chat/requests/${request?.id}/`, {
      accepted: true,
      driverStatus: !isMechanic ? 'accepted' : request?.driverStatus,
      mechanicStatus: isMechanic ? 'accepted' : request?.mechanicStatus
    })
    await mutate(`chat/requests/${request?.id}`)
  })
  const [onReject, isRejecting] = useIsLoading(async () => {
    await api.put(`chat/requests/${request?.id}/`, {
      accepted: false,
      driverStatus: !isMechanic ? 'rejected' : request?.driverStatus,
      mechanicStatus: isMechanic ? 'rejected' : request?.mechanicStatus
    })
    await mutate(`chat/requests/${request?.id}`)
  })
  const [onClose, isClosing] = useIsLoading(async () => {
    await api.put(`chat/requests/${request?.id}/`, {
      accepted: true,
      driverStatus: !isMechanic ? 'closed' : request?.driverStatus,
      mechanicStatus: isMechanic ? 'closed' : request?.mechanicStatus
    })
    await mutate(`chat/requests/${request?.id}`)
  })
  const [onResolved, isResolving] = useIsLoading(async () => {
    await api.put(`chat/requests/${request?.id}/`, {
      accepted: true,
      driverStatus: !isMechanic ? 'resolved' : request?.driverStatus,
      mechanicStatus: isMechanic ? 'resolved' : request?.mechanicStatus
    })
    await mutate(`chat/requests/${request?.id}`)
  })
  const myStatus = isMechanic ? request?.mechanicStatus : request?.driverStatus
  const otherStatus = isMechanic ? request?.driverStatus : request?.mechanicStatus

  if (isLoading || !request) return null

  if (request.mechanicStatus === 'rejected') {
    return (
      <div className="flex gap-2">
        <p className="text-small font-semibold text-default-400">
          {isMechanic ? 'Você rejeitou a solicitação' : 'A oficina rejeitou a solicitação'}
        </p>
      </div>
    )
  }

  if (request.mechanicStatus === 'pending') {
    return (
      <div className="flex gap-2">
        {!isMechanic && (
          <p className="text-small font-semibold text-default-400">Aguardando a oficina aceitar ou rejeitar</p>
        )}
        {isMechanic && (
          <>
            <Button
              color="success"
              size="sm"
              radius="lg"
              className="font-semibold"
              onPress={onAccept}
              isLoading={isAccepting}
              isDisabled={isRejecting}
            >
              Aceitar
            </Button>
            <Button
              color="danger"
              size="sm"
              radius="lg"
              className="font-semibold"
              onPress={onReject}
              isLoading={isRejecting}
              isDisabled={isAccepting}
            >
              Rejeitar
            </Button>
          </>
        )}
      </div>
    )
  }

  if (request.driverStatus === 'pending' || request.mechanicStatus === 'accepted') {
    if (myStatus === 'closed') {
      return (
        <div className="flex gap-2">
          <p className="text-small font-semibold text-default-400">Aguardando a outra parte fechar o negócio</p>
        </div>
      )
    }

    return (
      <div className="flex gap-2">
        <Button color="primary" size="sm" radius="lg" className="font-semibold" onPress={onClose} isLoading={isClosing}>
          Negócio fechado
        </Button>
      </div>
    )
  }

  if (myStatus === 'closed' || myStatus === 'resolved') {
    if (myStatus !== 'resolved') {
      return (
        <div className="flex gap-2">
          <Button
            color="primary"
            size="sm"
            radius="lg"
            className="font-semibold"
            onPress={onResolved}
            isLoading={isResolving}
          >
            Problema resolvido
          </Button>
        </div>
      )
    }

    if (otherStatus !== 'resolved') {
      return (
        <div className="flex gap-2">
          <p className="text-small font-semibold text-default-400">
            Aguardando a outra parte confirmar a resolução do problema
          </p>
        </div>
      )
    }
  }

  return null
}
