import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { AddressCreate } from '@/types/entities/address'

export function AddressModalFooter() {
  const form = useFormContext<AddressCreate>()
  const { isSubmitting } = form.formState

  return (
    <Modal.Footer>
      <Button type="submit" isLoading={isSubmitting}>
        Salvar
      </Button>
    </Modal.Footer>
  )
}
