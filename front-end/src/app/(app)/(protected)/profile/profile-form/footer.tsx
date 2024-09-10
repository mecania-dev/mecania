import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { len } from '@/lib/object'
import { UserUpdateInput } from '@/types/entities/user'

export function ProfileFormFooter() {
  const form = useFormContext<UserUpdateInput>()
  const { isSubmitting, dirtyFields } = form.formState

  return (
    <div className="flex justify-center gap-2">
      <Button type="submit" isLoading={isSubmitting} isDisabled={len(dirtyFields) === 0}>
        Salvar
      </Button>
      {len(dirtyFields) > 0 && (
        <Button color="secondary" onPress={() => form.reset()} isDisabled={isSubmitting}>
          Cancelar
        </Button>
      )}
    </div>
  )
}
