import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { Select } from '@/components/select'
import { TextArea } from '@/components/textarea'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { isNullOrEmpty } from '@/lib/assertions'
import { ServiceCreate } from '@/types/entities/service'
import { SharedSelection } from '@nextui-org/react'

export function ServiceModalBody() {
  const categories = useSWRCustom<{ key: string; value: string }[]>('services/categories/')
  const { watch, register, setValue, formState } = useFormContext<ServiceCreate>()
  const { errors } = formState
  const values = watch()

  function onCategoryChange(keys: SharedSelection) {
    setValue('category', keys.currentKey!, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <Modal.Body>
      <Input label="Nome" size="sm" errorMessage={errors.name?.message} {...register('name')} />
      <TextArea
        label="Descrição"
        size="sm"
        minRows={3}
        errorMessage={errors.description?.message}
        {...register('description')}
      />
      <Select
        label="Categoria"
        items={categories.state.data || []}
        valueKey="key"
        labelKey="value"
        selectedKeys={values.category ? [values.category] : []}
        onSelectionChange={onCategoryChange}
        errorMessage={errors.category?.message}
      />
      <Input
        type="number"
        label="Duração aprox. (minutos)"
        size="sm"
        errorMessage={errors.durationMinutes?.message}
        {...register('durationMinutes', { setValueAs: value => (isNullOrEmpty(value) ? undefined : Number(value)) })}
      />
    </Modal.Body>
  )
}
