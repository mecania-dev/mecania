import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { TextArea } from '@/components/textarea'
import { CategoryCreateInput } from '@/http'

export function CategoryModalBody() {
  const { register, formState } = useFormContext<CategoryCreateInput>()
  const { errors } = formState

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
    </Modal.Body>
  )
}
