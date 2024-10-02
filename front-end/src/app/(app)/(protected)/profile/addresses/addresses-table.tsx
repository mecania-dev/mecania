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
import { AddressCreateOutput, AddressUpdateOutput } from '@/http'
import { formatDate } from '@/lib/date'
import { useUser } from '@/providers/user-provider'
import { Address } from '@/types/entities/user'
import { Selection, Spinner, Tooltip } from '@nextui-org/react'

import { AddressModal, NewAddressModalButton } from './address-modal'

export function AddressesTable() {
  const { user } = useUser()
  const addresses = useSWRCustom<Address[]>(user ? `users/${user.id}/addresses/` : null, {
    fetcherConfig: { params: { paginate: false } }
  })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [selectedAddress, setSelectedAddress] = useState<Address>()

  const onCreateAddress = useCallback(
    async (address: AddressCreateOutput) => {
      await addresses.post(address, {
        onSuccess() {
          toast({ message: 'Endereço adicionado com sucesso', type: 'success' })
        },
        onError() {
          toast({ message: 'Erro ao adicionar endereço', type: 'error' })
        }
      })
    },
    [addresses]
  )

  const onUpdateAddress = useCallback(
    async (address: AddressUpdateOutput) => {
      await addresses.put(address, {
        url: url => url + `${address.id}/`,
        onSuccess() {
          toast({ message: 'Endereço atualizado com sucesso', type: 'success' })
        },
        onError() {
          toast({ message: 'Erro ao atualizar endereço', type: 'error' })
        }
      })
    },
    [addresses]
  )

  const handleDelete = useCallback(
    (address: Address) => () => {
      confirmationModal({
        size: 'sm',
        title: 'Remover endereço',
        question: `Tem certeza que deseja remover o endereço ${address.street}, ${address.number} - ${address.district}?`,
        async onConfirm() {
          const res = await addresses.remove({ url: url => url + address.id })
          if (res.ok) {
            toast({ message: 'Endereço deletado com sucesso', type: 'success' })
          } else {
            toast({ message: 'Erro ao remover endereço', type: 'error' })
          }
        }
      })
    },
    [addresses]
  )

  const renderCell = useCallback(
    (address: Address, columnKey: keyof Address | 'actions') => {
      if (columnKey === 'actions')
        return (
          <div className="relative flex items-center justify-around gap-2">
            <Tooltip content="Editar endereço">
              <span
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                onClick={() => setSelectedAddress(address)}
              >
                <BiEditAlt size={24} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Remover endereço">
              <span className="cursor-pointer text-lg text-danger active:opacity-50" onClick={handleDelete(address)}>
                <LuTrash2 size={24} />
              </span>
            </Tooltip>
          </div>
        )

      const cellValue = String(address[columnKey] ?? '')

      switch (columnKey) {
        case 'street':
          return <p className="font-bold">{`${cellValue}, ${address.number} - ${address.district}`}</p>
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

  const topContent: TableTopContent<Address> = useCallback(
    ({ filterFields, columns, TableSearch, TableColumnSelector }) => (
      <FlexWrap className="justify-between">
        <div className="flex gap-2">
          <TableColumnSelector columns={columns} />
          <NewAddressModalButton onSubmit={onCreateAddress} />
        </div>
        <TableSearch filterFields={filterFields} columns={columns} />
      </FlexWrap>
    ),
    [onCreateAddress]
  )

  return (
    <>
      <Table
        aria-label="Tabela de endereços"
        color="secondary"
        selectionMode="none"
        classNames={{
          base: 'max-h-full',
          wrapper: 'bg-default-200 dark:bg-default-100',
          th: 'dark:bg-default-200'
        }}
        items={addresses.state.data || []}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        topContent={topContent}
        renderCell={renderCell}
        filterFields={['street', 'number', 'district', 'city', 'state', 'country', 'zipCode']}
        initialVisibleColumns={['street', 'city', 'zipCode', 'actions']}
        bodyProps={{
          emptyContent: addresses.state.isLoading ? ' ' : 'Nenhum endereço encontrado.',
          isLoading: addresses.state.isLoading,
          loadingContent: <Spinner color="primary" />
        }}
        columns={[
          { name: 'ID', uid: 'id', sortable: true },
          { name: 'RUA', uid: 'street', sortable: true },
          { name: 'NÚMERO', uid: 'number', sortable: true },
          { name: 'BAIRRO', uid: 'district', sortable: true },
          { name: 'CIDADE', uid: 'city', sortable: true },
          { name: 'PAÍS', uid: 'country', sortable: true },
          { name: 'ESTADO', uid: 'state', sortable: true },
          { name: 'CEP', uid: 'zipCode', sortable: true },
          { name: 'ADICIONADO EM', uid: 'createdAt', sortable: true },
          { name: 'ATUALIZADO EM', uid: 'updatedAt', sortable: true },
          { name: 'AÇÕES', uid: 'actions' }
        ]}
      />
      {selectedAddress && (
        <AddressModal
          address={selectedAddress}
          isOpen={!!selectedAddress}
          setIsOpen={isOpen => {
            if (!isOpen) setSelectedAddress(undefined)
          }}
          onSubmit={onUpdateAddress}
        />
      )}
    </>
  )
}
