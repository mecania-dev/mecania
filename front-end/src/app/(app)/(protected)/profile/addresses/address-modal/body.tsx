import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { ZipCodeInput } from '@/components/input/zip-code'
import { Modal } from '@/components/modal'
import { AddressCreateInput, ZipCodeResponse } from '@/http'

export function AddressModalBody() {
  const { watch, register, setValue, formState } = useFormContext<AddressCreateInput>()
  const { errors } = formState
  const values = watch()

  async function onCEPChange(address?: ZipCodeResponse, zipCode?: string) {
    const opts = { shouldValidate: !!address, shouldDirty: true }
    zipCode && setValue('zipCode', zipCode, opts)
    setValue('state', address?.state ?? '', opts)
    setValue('city', address?.city ?? '', opts)
    setValue('district', address?.neighborhood ?? '', opts)
    setValue('street', address?.street ?? '', opts)
  }

  return (
    <Modal.Body>
      <ZipCodeInput
        size="sm"
        placeholder="CEP"
        value={values?.zipCode}
        onZipCodeChange={onCEPChange}
        errorMessage={errors.zipCode?.message}
        {...register('zipCode')}
      />
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
