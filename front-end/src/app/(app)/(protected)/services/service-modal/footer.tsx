import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { ServiceCreateInput } from '@/http'

export function ServiceModalFooter() {
  const form = useFormContext<ServiceCreateInput>()
  const { isSubmitting } = form.formState

  return (
    <Modal.Footer>
      <Button type="submit" isLoading={isSubmitting}>
        Salvar
      </Button>
    </Modal.Footer>
  )
}
