import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { toast } from '@/hooks/use-toast'
import { CNPJApiResponse, SignUpRequest } from '@/http'

export function SignUpMechanicFormBody() {
  const { watch, register, setValue, formState } = useFormContext<SignUpRequest>()
  const { errors } = formState
  const values = watch()

  function onCNPJChange(cnpj?: CNPJApiResponse) {
    if (!values.firstName && cnpj?.razao_social) {
      setValue('firstName', cnpj.razao_social, { shouldValidate: true })
    }
  }

  function onCNPJNotFound(cnpj: string) {
    toast({
      message: `Dados para o CNPJ ${cnpj} não encontrados. Preencha o campo "Nome da oficina" manualmente.`,
      type: 'error'
    })
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="Nome da oficina"
        description="Ao digitar o CNPJ, este campo será preenchido automaticamente. (se vazio)"
        value={values.firstName}
        errorMessage={errors.firstName?.message}
        {...register('firstName')}
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
        type="CNPJ"
        placeholder="CNPJ"
        value={values.fiscalIdentification}
        errorMessage={errors.fiscalIdentification?.message}
        onCNPJChange={!values.firstName ? onCNPJChange : undefined}
        onCNPJNotFound={onCNPJNotFound}
        autoComplete="cnpj"
        {...register('fiscalIdentification')}
      />
      <PasswordInput
        placeholder="Senha"
        value={values.password}
        errorMessage={errors.password?.message}
        autoComplete="new-password"
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
