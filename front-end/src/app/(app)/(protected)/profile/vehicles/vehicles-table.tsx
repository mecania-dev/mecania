'use client'

import { useCallback, useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'

import { FlexWrap } from '@/components/flex-wrap'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { confirmationModal } from '@/hooks/use-confirmation-modal'
import { useVehicles } from '@/mocks/use-vehicles'
import { Vehicle } from '@/types/entities/vehicle'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'

import { NewVehicleModalButton } from './vehicle-modal'

export function VehiclesTable() {
  const { vehicles, removeVehicle } = useVehicles()
  const { state: vehiclesState } = useSWRCustom<Vehicle[]>(null, { fallbackData: vehicles })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const handleDelete = useCallback(
    (vehicle: Vehicle) => () => {
      confirmationModal({
        size: 'sm',
        title: 'Remover veículo',
        question: `Tem certeza que deseja deletar o veículo ${vehicle.brand} ${vehicle.model}?`,
        async onConfirm() {
          removeVehicle(vehiclesState.data?.indexOf(vehicle) || 0)
        }
      })
    },
    [removeVehicle, vehiclesState.data]
  )

  const renderCell = useCallback(
    (vehicle: Vehicle, columnKey: keyof Vehicle | 'actions') => {
      if (columnKey === 'actions')
        return (
          <div className="relative flex items-center justify-around gap-2">
            <Tooltip color="danger" content="Remover veículo">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(vehicle)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      const cellValue = String(vehicle[columnKey])

      switch (columnKey) {
        case 'brand':
          return <p className="font-bold">{cellValue}</p>
        default:
          return cellValue
      }
    },
    [handleDelete]
  )

  const topContent: TableTopContent<Vehicle> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <FlexWrap className="justify-between">
        <div className="flex gap-2">
          <TableColumnSelector columns={columns} />
          <NewVehicleModalButton />
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    []
  )

  return (
    <Table
      aria-label="Tabela de veículos"
      color="secondary"
      selectionMode="none"
      classNames={{
        base: 'max-h-full',
        wrapper: 'bg-default-200 dark:bg-default-100',
        th: 'dark:bg-default-200'
      }}
      items={vehiclesState.data || []}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      topContent={topContent}
      renderCell={renderCell}
      filterFields={['brand', 'model', 'year', 'kilometers', 'plate', 'chassis']}
      initialVisibleColumns={['brand', 'model', 'year', 'kilometers', 'actions']}
      bodyProps={{
        emptyContent: vehiclesState.isLoading ? ' ' : 'Nenhum veículo encontrado.',
        isLoading: vehiclesState.isLoading,
        loadingContent: <Spinner color="primary" />
      }}
      columns={[
        { name: 'ID', uid: 'id', sortable: true },
        { name: 'MARCA', uid: 'brand', sortable: true },
        { name: 'MODELO', uid: 'model', sortable: true },
        { name: 'ANO', uid: 'year', sortable: true },
        { name: 'KM', uid: 'kilometers', sortable: true },
        { name: 'PLACA', uid: 'plate', sortable: true },
        { name: 'CHASSI', uid: 'chassis', sortable: true },
        { name: 'CRIADO EM', uid: 'createdAt', sortable: true },
        { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
        { name: 'AÇÕES', uid: 'actions' }
      ]}
    />
  )
}
