'use client'

import { useCallback, useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import { Button } from '@/components/button'
import { FlexWrap } from '@/components/flex-wrap'
import { confirmationModal } from '@/components/modal'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { toast } from '@/hooks/use-toast'
import { ServiceCreateOutput } from '@/http'
import { formatDate } from '@/lib/date'
import { Service } from '@/types/entities/service'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'
import { groupBy } from 'lodash'

import { NewServiceModalButton } from './service-modal'

export function ServicesTable() {
  const services = useSWRCustom<Service[]>('services/', {
    fetcherConfig: { params: { paginate: false } }
  })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const onCreateService = useCallback(
    async (service: ServiceCreateOutput) => {
      const res = await services.post(service)
      if (res.ok) {
        toast({ message: 'Serviço adicionado com sucesso', type: 'success' })
      } else {
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
        question: `Tem certeza que deseja remover o serviço ${service.name}?`,
        async onConfirm() {
          const res = await services.remove({ url: url => url + service.id })
          if (res.ok) {
            toast({ message: 'Serviço deletado com sucesso', type: 'success' })
          } else {
            toast({ message: 'Erro ao remover serviço', type: 'error' })
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
            <Tooltip color="danger" content="Remover serviço">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(service)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      if (columnKey === 'category') {
        return service.category.name
      }

      const cellValue = String(service[columnKey] ?? '')

      switch (columnKey) {
        case 'name':
          return <p className="font-bold">{cellValue}</p>
        case 'description':
          return <p className="max-w-72 truncate md:max-w-96">{cellValue}</p>
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

  const downloadJson = useCallback(() => {
    if (!services.state.data) return
    // Group services by category name
    const grouped = groupBy(services.state.data, service => service.category.name)
    // Format the data to { category: 'category.name', services: [] }
    const formattedData = Object.keys(grouped).map(categoryName => ({
      categoryId: grouped[categoryName][0].category.id,
      category: categoryName,
      services: grouped[categoryName].map(({ id, name, description, vehicleType }) => {
        if (description) return { id, name, description, vehicleType }
        return { id, name, vehicleType }
      })
    }))
    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' })
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'services.json'
    link.click()
    // Clean up the URL object
    URL.revokeObjectURL(url)
  }, [services.state.data])

  const topContent: TableTopContent<Service> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <FlexWrap className="justify-between">
        <div className="flex flex-wrap gap-2">
          <TableColumnSelector columns={columns} />
          <NewServiceModalButton onSubmit={onCreateService} />
          <Button onPress={downloadJson}>Download JSON</Button>
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    [onCreateService, downloadJson]
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
      filterFields={['name', 'description', 'durationMinutes']}
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
        { name: 'ADICIONADO EM', uid: 'createdAt', sortable: true },
        { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
        { name: 'AÇÕES', uid: 'actions' }
      ]}
    />
  )
}
