import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { PasswordInput } from '@/components/input/password'
import { SignInRequest } from '@/types/auth'

export function SignInFormBody() {
  const { register, formState } = useFormContext<SignInRequest>()
  const { errors } = formState

  return (
    <div className="space-y-2">
      <Input placeholder="Email ou nome de usuário" errorMessage={errors.login?.message} {...register('login')} />
      <PasswordInput errorMessage={errors.password?.message} {...register('password')} />
    </div>
  )
}
