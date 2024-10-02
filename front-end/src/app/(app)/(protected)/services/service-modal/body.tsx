import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { Select } from '@/components/select'
import { TextArea } from '@/components/textarea'
import { useSWRCustom } from '@/hooks/swr/use-swr-custom'
import { ServiceCreateInput } from '@/http'
import { isNullOrEmpty } from '@/lib/assertions'
import { Category } from '@/types/entities/service'
import { SharedSelection } from '@nextui-org/react'

import { useCategoryModal } from '../category-modal/use-category-modal'

export function ServiceModalBody() {
  const categoryModal = useCategoryModal()
  const categories = useSWRCustom<Category[]>('services/categories/', {
    fetcherConfig: { params: { paginate: false } }
  })
  const { watch, register, setValue, formState } = useFormContext<ServiceCreateInput>()
  const { errors } = formState
  const values = watch()

  function onCategoryChange(keys: SharedSelection) {
    setValue('category', keys.currentKey!, { shouldValidate: true, shouldDirty: true })
  }

  function onAddNewCategory() {
    categoryModal.setIsOpen(true)
    categoryModal.setOnSubmit(async category => {
      const res = await categories.post<Category>(category)
      if (res.ok) {
        setValue('category', res.data.id.toString(), { shouldValidate: true, shouldDirty: true })
      }
      return res
    })
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
        valueKey="id"
        labelKey="name"
        selectedKeys={values.category ? [values.category] : []}
        onSelectionChange={onCategoryChange}
        onAddNew={onAddNewCategory}
        errorMessage={errors.category?.message}
        isLoading={categories.state.isLoading}
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
