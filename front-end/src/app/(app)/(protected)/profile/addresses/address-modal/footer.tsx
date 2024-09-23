import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { AddressCreateInput } from '@/http/address/create'

export function AddressModalFooter() {
  const form = useFormContext<AddressCreateInput>()
  const { isSubmitting } = form.formState

  return (
    <Modal.Footer>
      <Button type="submit" isLoading={isSubmitting}>
        Salvar
      </Button>
    </Modal.Footer>
  )
}
