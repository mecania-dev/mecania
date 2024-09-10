import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { VehicleCreate } from '@/types/entities/vehicle'

export function VehicleModalBody() {
  const { register, formState } = useFormContext<VehicleCreate>()
  const { errors } = formState

  return (
    <Modal.Body>
      <Input label="Marca" size="sm" errorMessage={errors.brand?.message} {...register('brand')} />
      <Input label="Modelo" size="sm" errorMessage={errors.model?.message} {...register('model')} />
      <Input label="Ano" size="sm" errorMessage={errors.year?.message} {...register('year')} />
      <Input label="Quilometragem" size="sm" errorMessage={errors.kilometers?.message} {...register('kilometers')} />
      <Input label="Placa" size="sm" errorMessage={errors.plate?.message} {...register('plate')} />
      <Input label="Chassi" size="sm" errorMessage={errors.chassis?.message} {...register('chassis')} />
    </Modal.Body>
  )
}
