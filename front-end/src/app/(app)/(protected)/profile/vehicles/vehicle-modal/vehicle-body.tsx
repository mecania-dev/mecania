import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { Select } from '@/components/select'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { VehicleCreateInput } from '@/http'
import { Choice } from '@/types/choices'
import { SharedSelection } from '@nextui-org/react'

export function VehicleModalBody() {
  const fuelChoices = useSWRCustom<Choice[]>('vehicles/fuel-choices/')
  const transmissionChoices = useSWRCustom<Choice[]>('vehicles/transmission-choices/')
  const { watch, register, formState, setValue } = useFormContext<VehicleCreateInput>()
  const { errors } = formState
  const values = watch()

  function onTransmissionChange(keys: SharedSelection) {
    setValue('transmission', keys.currentKey!, { shouldValidate: true, shouldDirty: true })
  }

  function onFuelChange(keys: SharedSelection) {
    setValue('fuelType', keys.currentKey!, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <Modal.Body>
      <Input label="Marca" size="sm" errorMessage={errors.brand?.message} {...register('brand')} isRequired />
      <Input label="Modelo" size="sm" errorMessage={errors.model?.message} {...register('model')} isRequired />
      <Input
        type="number"
        inputMode="numeric"
        label="Ano"
        size="sm"
        errorMessage={errors.year?.message}
        {...register('year', { setValueAs: value => (value ? Number(value) : undefined) })}
        isRequired
      />
      <Input
        type="number"
        inputMode="numeric"
        label="Quilometragem"
        size="sm"
        errorMessage={errors.mileage?.message}
        {...register('mileage', { setValueAs: value => (value ? Number(value) : undefined) })}
      />
      <Select
        size="sm"
        label="Transmissão"
        items={transmissionChoices.state.data || []}
        valueKey="value"
        labelKey="label"
        selectedKeys={values.transmission ? [values.transmission] : []}
        onSelectionChange={onTransmissionChange}
        errorMessage={errors.transmission?.message}
      />
      <Select
        size="sm"
        label="Tipo de Combustível"
        items={fuelChoices.state.data || []}
        valueKey="value"
        labelKey="label"
        selectedKeys={values.fuelType ? [values.fuelType] : []}
        onSelectionChange={onFuelChange}
        errorMessage={errors.fuelType?.message}
      />
      <Input label="Placa" size="sm" errorMessage={errors.licensePlate?.message} {...register('licensePlate')} />
      <Input label="Chassi" size="sm" errorMessage={errors.chassisNumber?.message} {...register('chassisNumber')} />
      <Input
        type="number"
        inputMode="numeric"
        label="Cilindros"
        size="sm"
        errorMessage={errors.cylinderCount?.message}
        {...register('cylinderCount', { setValueAs: value => (value ? Number(value) : undefined) })}
      />
    </Modal.Body>
  )
}
