import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { Service } from '@/types/entities/service'
import { Selection } from '@nextui-org/react'

import { Select } from '.'

export interface ServicesSelectProps {
  selectedServices: Selection
  setSelectedServices: React.Dispatch<React.SetStateAction<Selection>>
}

export function ServicesSelect({ selectedServices, setSelectedServices }: ServicesSelectProps) {
  const { state } = useSWRCustom<Service[]>(`services/`, { fetcherConfig: { params: { paginate: false } } })
  const services = state.data ?? []

  return (
    <Select
      variant="faded"
      selectionMode="multiple"
      items={services}
      valueKey="id"
      labelKey="name"
      selectedKeys={selectedServices}
      onSelectionChange={setSelectedServices}
      className="w-60 max-w-full"
      isLoading={state.isLoading}
    />
  )
}
