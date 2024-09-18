import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { ZipCodeInput } from '@/components/input/zip-code'
import { Modal } from '@/components/modal'
import { ZipCodeResponse } from '@/http'
import { AddressCreate } from '@/types/entities/address'

export function AddressModalBody() {
  const { watch, register, setValue, formState } = useFormContext<AddressCreate>()
  const { errors } = formState
  const values = watch()

  async function onCEPChange(address?: ZipCodeResponse, zipCode?: string) {
    const opts = { shouldValidate: true, shouldDirty: true }
    setValue('zipCode', zipCode as string, opts)
    setValue('state', address?.state as string, opts)
    setValue('city', address?.city as string, opts)
    setValue('district', address?.neighborhood as string, opts)
    setValue('street', address?.street as string, opts)
  }

  return (
    <Modal.Body>
      <ZipCodeInput size="sm" placeholder="CEP" onZipCodeChange={onCEPChange} errorMessage={errors.zipCode?.message} />
      <Input size="sm" placeholder="Estado" value={values?.state} errorMessage={errors.state?.message} isReadOnly />
      <Input size="sm" placeholder="Cidade" value={values?.city} errorMessage={errors.city?.message} isReadOnly />
      <Input
        size="sm"
        placeholder="Bairro"
        value={values?.district}
        errorMessage={errors.district?.message}
        isReadOnly
      />
      <Input size="sm" placeholder="Rua" value={values?.street} errorMessage={errors.street?.message} isReadOnly />
      <Input size="sm" placeholder="Número" errorMessage={errors.number?.message} {...register('number')} />
      <Input
        size="sm"
        placeholder="Complemento"
        errorMessage={errors.complement?.message}
        {...register('complement')}
      />
    </Modal.Body>
  )
}
