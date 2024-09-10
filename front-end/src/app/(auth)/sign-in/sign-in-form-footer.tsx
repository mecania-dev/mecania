import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/button'
import { SignInRequest } from '@/types/auth'

export function SignInFormFooter() {
  const form = useFormContext<SignInRequest>()
  const { isSubmitting } = form.formState

  return (
    <Button type="submit" className="w-full" isLoading={isSubmitting}>
      Entrar
    </Button>
  )
}
