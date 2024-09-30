'use client'

import { useCallback, useState } from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { LuTrash2 } from 'react-icons/lu'

import { FlexWrap } from '@/components/flex-wrap'
import { confirmationModal } from '@/components/modal'
import { Table } from '@/components/table'
import { TableTopContent } from '@/components/table/types'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { toast } from '@/hooks/use-toast'
import { VehicleCreateOutput } from '@/http'
import { VehicleUpdateOutput } from '@/http/user/vehicle/update'
import { formatDate } from '@/lib/date'
import { useUser } from '@/providers/user-provider'
import { Vehicle } from '@/types/entities/vehicle'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'

import { NewVehicleModalButton, VehicleModal } from './vehicle-modal'

export function VehiclesTable() {
  const { user } = useUser()
  const vehicles = useSWRCustom<Vehicle[]>(`users/${user?.id}/vehicles/`, {
    fetcherConfig: { params: { paginate: false } }
  })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>()

  const onCreateVehicle = useCallback(
    async (vehicle: VehicleCreateOutput) => {
      const res = await vehicles.post(vehicle)
      if (res.ok) {
        toast({ message: 'Veículo adicionado com sucesso', type: 'success' })
      } else {
        toast({ message: 'Erro ao criar veículo', type: 'error' })
      }
    },
    [vehicles]
  )

  const onUpdateVehicle = useCallback(
    async (vehicle: VehicleUpdateOutput) => {
      await vehicles.put(vehicle, {
        url: url => url + `${vehicle.id}/`,
        onSuccess() {
          toast({ message: 'Veículo atualizado com sucesso', type: 'success' })
        },
        onError() {
          toast({ message: 'Erro ao atualizar veículo', type: 'error' })
        }
      })
    },
    [vehicles]
  )

  const handleDelete = useCallback(
    (vehicle: Vehicle) => () => {
      confirmationModal({
        size: 'sm',
        title: 'Remover veículo',
        question: `Tem certeza que deseja remover o veículo ${vehicle.brand} ${vehicle.model} ${vehicle.year}?`,
        async onConfirm() {
          const res = await vehicles.remove({ url: url => url + vehicle.id })
          if (res.ok) {
            toast({ message: 'Veículo deletado com sucesso', type: 'success' })
          } else {
            toast({ message: 'Erro ao remover veículo', type: 'error' })
          }
        }
      })
    },
    [vehicles]
  )

  const renderCell = useCallback(
    (vehicle: Vehicle, columnKey: keyof Vehicle | 'actions') => {
      if (columnKey === 'actions')
        return (
          <div className="relative flex items-center justify-around gap-2">
            <Tooltip content="Editar veículo">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <BiEditAlt size={24} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Remover veículo">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(vehicle)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      const cellValue = String(vehicle[columnKey] ?? '')

      switch (columnKey) {
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

  const topContent: TableTopContent<Vehicle> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <FlexWrap className="justify-between">
        <div className="flex gap-2">
          <TableColumnSelector columns={columns} />
          <NewVehicleModalButton onSubmit={onCreateVehicle} />
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    [onCreateVehicle]
  )

  return (
    <>
      <Table
        aria-label="Tabela de veículos"
        color="secondary"
        selectionMode="none"
        classNames={{
          base: 'max-h-full',
          wrapper: 'bg-default-200 dark:bg-default-100',
          th: 'dark:bg-default-200'
        }}
        items={vehicles.state.data || []}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        topContent={topContent}
        renderCell={renderCell}
        filterFields={['brand', 'model', 'year', 'transmission']}
        initialVisibleColumns={['brand', 'model', 'year', 'transmission', 'actions']}
        bodyProps={{
          emptyContent: vehicles.state.isLoading ? ' ' : 'Nenhum veículo encontrado.',
          isLoading: vehicles.state.isLoading,
          loadingContent: <Spinner color="primary" />
        }}
        columns={[
          { name: 'ID', uid: 'id', sortable: true },
          { name: 'MARCA', uid: 'brand', sortable: true },
          { name: 'MODELO', uid: 'model', sortable: true },
          { name: 'ANO', uid: 'year', sortable: true },
          { name: 'TRANSMISSÃO', uid: 'transmission', sortable: true },
          { name: 'ADICIONADO EM', uid: 'createdAt', sortable: true },
          { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
          { name: 'AÇÕES', uid: 'actions' }
        ]}
      />
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          isOpen={!!selectedVehicle}
          setIsOpen={isOpen => {
            if (!isOpen) setSelectedVehicle(undefined)
          }}
          onSubmit={onUpdateVehicle}
        />
      )}
    </>
  )
}
