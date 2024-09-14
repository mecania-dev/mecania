import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { SignUpRequest } from '@/http'

export function SignUpCustomerFormBody() {
  const { watch, register, formState } = useFormContext<SignUpRequest>()
  const { errors } = formState
  const values = watch()

  return (
    <div className="space-y-2">
      <Input
        placeholder="Nome"
        value={values.firstName}
        errorMessage={errors.firstName?.message}
        {...register('firstName')}
      />
      <Input
        placeholder="Sobrenome"
        value={values.lastName}
        errorMessage={errors.lastName?.message}
        {...register('lastName')}
      />
      <Input
        placeholder="Nome de usuário"
        value={values.username}
        errorMessage={errors.username?.message}
        {...register('username')}
      />
      <Input placeholder="E-mail" value={values.email} errorMessage={errors.email?.message} {...register('email')} />
      <PhoneNumberInput
        placeholder="Telefone"
        value={values.phoneNumber}
        errorMessage={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />
      <FiscalIdentificationInput
        placeholder="CPF"
        value={values.fiscalIdentification}
        errorMessage={errors.fiscalIdentification?.message}
        {...register('fiscalIdentification')}
      />
      <PasswordInput
        placeholder="Senha"
        value={values.password}
        errorMessage={errors.password?.message}
        {...register('password')}
      />
      <PasswordInput
        placeholder="Confirmar senha"
        value={values.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
    </div>
  )
}
