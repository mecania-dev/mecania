import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { SignUpRequest } from '@/types/auth'

export function SignUpFormFooter() {
  const form = useFormContext<SignUpRequest>()
  const { isSubmitting } = form.formState

  return (
    <Button type="submit" className="w-full" isLoading={isSubmitting}>
      Registrar
    </Button>
  )
}
