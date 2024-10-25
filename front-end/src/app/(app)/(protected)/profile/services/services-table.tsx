'use client'

import { useCallback, useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import { Button } from '@/components/button'
import { FlexWrap } from '@/components/flex-wrap'
import { confirmationModal } from '@/components/modal'
import { ServicesSelect } from '@/components/select/services-select'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { toast } from '@/hooks/use-toast'
import { addServices } from '@/http'
import { formatDate } from '@/lib/date'
import { useUser } from '@/providers/user-provider'
import { Service } from '@/types/entities/service'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'
import { mutate } from 'swr'

export function ServicesTable() {
  const { user } = useUser()
  const services = useSWRCustom<Service[]>(user ? `users/${user.id}/services/` : null, {
    fetcherConfig: { params: { paginate: false } }
  })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [selectedServices, setSelectedServices] = useState<Selection>(new Set([]))

  const onAddServices = useCallback(async () => {
    if (typeof selectedServices === 'string' || selectedServices.size === 0) return

    await addServices(user!.id, Array.from(selectedServices.values()).map(Number), {
      onSuccess() {
        toast({ message: 'Serviços vinculados com sucesso', type: 'success' })
        mutate(`users/${user!.id}/services/`)
      },
      onError() {
        toast({ message: 'Erro ao vincular serviços', type: 'error' })
      }
    })

    setSelectedServices(new Set([]))
  }, [selectedServices, user])

  const handleDelete = useCallback(
    (service: Service) => () => {
      confirmationModal({
        size: 'sm',
        title: 'Desvincular serviço',
        question: `Tem certeza que deseja desvincular o serviço ${service.name}?`,
        async onConfirm() {
          const res = await services.remove({ url: url => url + service.id })
          if (res.ok) {
            toast({ message: 'Serviço desvinculado com sucesso', type: 'success' })
            mutate(`users/${user!.id}/services/`)
          } else {
            toast({ message: 'Erro ao desvincular serviço', type: 'error' })
          }
        }
      })
    },
    [services, user]
  )

  const renderCell = useCallback(
    (service: Service, columnKey: keyof Service | 'actions') => {
      if (columnKey === 'actions')
        return (
          <div className="relative flex items-center justify-around gap-2">
            <Tooltip color="danger" content="Desvincular serviço">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(service)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      const cellValue = String(service[columnKey] ?? '')

      switch (columnKey) {
        case 'name':
          return <p className="font-bold">{cellValue}</p>
        case 'category':
          return <p className="font-bold">{service.category.name}</p>
        case 'createdAt':
          return <p>{formatDate(cellValue)}</p>
        case 'updatedAt':
          return <p>{formatDate(cellValue)}</p>
        default:
          return cellValue
      }
    },
    [handleDelete]
  )

  const topContent: TableTopContent<Service> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <FlexWrap className="justify-between">
        <div className="flex gap-2">
          <TableColumnSelector columns={columns} />
          <div className="flex justify-end gap-2">
            <ServicesSelect selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
            <Button color="secondary" onPress={onAddServices}>
              Vincular
            </Button>
          </div>
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    [onAddServices, selectedServices]
  )

  return (
    <Table
      aria-label="Tabela de serviços"
      color="secondary"
      selectionMode="none"
      classNames={{
        base: 'max-h-full',
        wrapper: 'bg-default-200 dark:bg-default-100',
        th: 'dark:bg-default-200'
      }}
      items={services.state.data || []}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      renderCell={renderCell}
      filterFields={['name', 'description', 'category']}
      initialVisibleColumns={['name', 'category', 'actions']}
      bodyProps={{
        emptyContent: services.state.isLoading ? ' ' : 'Nenhum serviço vinculado.',
        isLoading: services.state.isLoading,
        loadingContent: <Spinner color="primary" />
      }}
      columns={[
        { name: 'ID', uid: 'id', sortable: true },
        { name: 'NOME', uid: 'name', sortable: true },
        { name: 'DESCRIÇÃO', uid: 'description', sortable: true },
        { name: 'CATEGORIA', uid: 'category', sortable: true },
        { name: 'ADICIONADO EM', uid: 'createdAt', sortable: true },
        { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
        { name: 'AÇÕES', uid: 'actions' }
      ]}
    />
  )
}
