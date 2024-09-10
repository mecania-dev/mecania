import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { VehicleCreate } from '@/types/entities/vehicle'

export function VehicleModalFooter() {
  const form = useFormContext<VehicleCreate>()
  const { isSubmitting } = form.formState

  return (
    <Modal.Footer>
      <Button type="submit" isLoading={isSubmitting}>
        Salvar
      </Button>
    </Modal.Footer>
  )
}
