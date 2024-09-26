import { Modal, ModalProps } from '@/components/modal'
import { setFormErrors, useForm } from '@/hooks/use-form'
import { categoryCreateFields, CategoryCreateInput, CategoryCreateOutput, categoryCreateSchema } from '@/http'
import { zodResolver } from '@hookform/resolvers/zod'

import { CategoryModalBody } from './body'
import { CategoryModalFooter } from './footer'
import { useCategoryModal } from './use-category-modal'

interface CategoryModalProps
  extends Omit<ModalProps, 'children' | 'isOpen' | 'onOpenChange' | 'onSubmit' | 'form' | 'onFormSubmit'> {}

export function CategoryModal({ title = 'Nova Categoria', size = 'sm', ...rest }: CategoryModalProps) {
  const categoryModal = useCategoryModal()
  const form = useForm<CategoryCreateInput>({ resolver: zodResolver(categoryCreateSchema) })

  async function handleOnSubmit(category: CategoryCreateOutput) {
    const res = await categoryModal.onSubmit?.(category)
    if (res && !res.ok) {
      return setFormErrors(form, (res.data as any)?.response?.data, categoryCreateFields)
    }
    categoryModal.setIsOpen(false)
  }

  return (
    <Modal
      title={title}
      size={size}
      form={form}
      isOpen={categoryModal.isOpen}
      onOpenChange={categoryModal.setIsOpen}
      onFormSubmit={handleOnSubmit}
      fullScreen={false}
      {...rest}
    >
      <CategoryModalBody />
      <CategoryModalFooter />
    </Modal>
  )
}
