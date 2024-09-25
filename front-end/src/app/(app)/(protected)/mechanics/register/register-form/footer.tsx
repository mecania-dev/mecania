import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { MechanicCreateInput } from '@/http'
import { len } from '@/lib/object'

export function MechanicFormFooter() {
  const form = useFormContext<MechanicCreateInput>()
  const { isSubmitting, dirtyFields } = form.formState

  return (
    <div className="flex justify-center gap-2">
      <Button type="submit" isLoading={isSubmitting} isDisabled={len(dirtyFields) === 0}>
        Adicionar
      </Button>
      {len(dirtyFields) > 0 && (
        <Button color="secondary" onPress={() => form.reset()} isDisabled={isSubmitting}>
          Cancelar
        </Button>
      )}
    </div>
  )
}
