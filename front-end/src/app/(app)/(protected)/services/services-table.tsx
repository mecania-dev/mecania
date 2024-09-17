'use client'

import { useCallback, useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import { FlexWrap } from '@/components/flex-wrap'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { confirmationModal } from '@/hooks/use-confirmation-modal'
import { toast } from '@/hooks/use-toast'
import { Service, ServiceCreate } from '@/types/entities/service'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'

import { NewServiceModalButton } from './service-modal'

export function ServicesTable() {
  const services = useSWRCustom<Service[]>('services/')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const onCreateService = useCallback(
    async (service: ServiceCreate) => {
      const res = await services.post(service)
      if (!res.ok) {
        toast({ message: 'Erro ao criar serviço', type: 'error' })
      }
    },
    [services]
  )

  const handleDelete = useCallback(
    (service: Service) => () => {
      confirmationModal({
        size: 'sm',
        title: 'Remover serviço',
        question: `Tem certeza que deseja deletar o serviço ${service.name}?`,
        async onConfirm() {
          const res = await services.remove({ url: `services/${service.id}/` })
          if (res.ok) {
            toast({ message: 'Serviço deletado com sucesso', type: 'success' })
          } else {
            toast({ message: 'Erro ao deletar serviço', type: 'error' })
          }
        }
      })
    },
    [services]
  )

  const renderCell = useCallback(
    (service: Service, columnKey: keyof Service | 'actions') => {
      if (columnKey === 'actions')
        return (
          <div className="relative flex items-center justify-around gap-2">
            <Tooltip color="danger" content="Remover veículo">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(service)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      const cellValue = String(service[columnKey])

      switch (columnKey) {
        case 'name':
          return <p className="font-bold">{cellValue}</p>
        case 'description':
          return <p className="max-w-72 truncate md:max-w-96">{cellValue}</p>
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
          <NewServiceModalButton onSubmit={onCreateService} />
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    [onCreateService]
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
      filterFields={['name', 'description', 'category', 'durationMinutes']}
      initialVisibleColumns={['name', 'category', 'description', 'actions']}
      bodyProps={{
        emptyContent: services.state.isLoading ? ' ' : 'Nenhum serviço encontrado.',
        isLoading: services.state.isLoading,
        loadingContent: <Spinner color="primary" />
      }}
      columns={[
        { name: 'ID', uid: 'id', sortable: true },
        { name: 'NOME', uid: 'name', sortable: true },
        { name: 'CATEGORIA', uid: 'category', sortable: true },
        { name: 'DESCRIÇÃO', uid: 'description', sortable: true },
        { name: 'DURAÇÃO', uid: 'durationMinutes', sortable: true },
        { name: 'CRIADO EM', uid: 'createdAt', sortable: true },
        { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
        { name: 'AÇÕES', uid: 'actions' }
      ]}
    />
  )
}
