import { useFormContext } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { toast } from '@/hooks/use-toast'
import { CNPJApiResponse, getZipCode } from '@/http'
import { MechanicCreateInput } from '@/http/user/create-mechanic'
import { phoneNumberMask } from '@/lib/masks/phone-number'
import { defaultStringValue } from '@/lib/string'

export function MechanicFormBody() {
  const { watch, register, setValue, formState } = useFormContext<MechanicCreateInput>()
  const { defaultValues, errors } = formState
  const values = watch()

  async function onCNPJChange(cnpj?: CNPJApiResponse) {
    if (cnpj?.razao_social) {
      setValue('firstName', cnpj.razao_social, { shouldValidate: true, shouldDirty: true })
    }

    if (cnpj?.ddd_telefone_1) {
      setValue('phoneNumber', phoneNumberMask(cnpj.ddd_telefone_1), { shouldValidate: true, shouldDirty: true })
    }

    if (cnpj?.cep && cnpj.numero) {
      const addressRes = await getZipCode(cnpj.cep)
      if (addressRes.ok) {
        const address = addressRes.data
        setValue(
          'addresses',
          [
            {
              street: address.street,
              number: cnpj.numero,
              district: address.neighborhood,
              city: address.city,
              state: address.state,
              zipCode: address.cep,
              country: 'BR',
              complement: cnpj.complemento
            }
          ],
          { shouldValidate: true, shouldDirty: true }
        )
      }
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
      <FlexWrap>
        <FiscalIdentificationInput
          type="CNPJ"
          size="sm"
          label="CNPJ"
          value={values.fiscalIdentification ?? ''}
          placeholder={defaultValues?.fiscalIdentification ?? ''}
          errorMessage={errors.fiscalIdentification?.message}
          onCNPJChange={onCNPJChange}
          onCNPJNotFound={onCNPJNotFound}
          {...register('fiscalIdentification')}
        />
        <Input
          size="sm"
          label="Nome da empresa"
          value={values.firstName}
          placeholder={defaultValues?.firstName}
          errorMessage={errors.firstName?.message}
          {...register('firstName')}
        />
      </FlexWrap>
      <FlexWrap>
        <Input
          size="sm"
          label="Nome de usuário"
          value={values.username}
          placeholder={defaultValues?.username}
          errorMessage={errors.username?.message}
          {...register('username')}
        />
        <Input
          size="sm"
          label="Email"
          value={values.email}
          placeholder={defaultValues?.email}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
      </FlexWrap>
      <FlexWrap>
        <PhoneNumberInput
          size="sm"
          label="Telefone"
          value={values.phoneNumber ?? ''}
          placeholder={defaultValues?.phoneNumber ?? ''}
          errorMessage={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <Input
          type="number"
          inputMode="numeric"
          size="sm"
          label="Availiação"
          value={String(values.rating)}
          placeholder={String(defaultValues?.rating)}
          errorMessage={errors.rating?.message}
          {...register('rating', { setValueAs: value => Number(value || 1) })}
        />
      </FlexWrap>
      <FlexWrap>
        <PasswordInput
          size="sm"
          label="Senha"
          value={values.password}
          placeholder={defaultValues?.password}
          errorMessage={errors.password?.message}
          autoComplete="new-password"
          {...register('password', { setValueAs: value => defaultStringValue(value, undefined) })}
        />
        <PasswordInput
          size="sm"
          label="Confirme a Senha"
          value={values.confirmPassword}
          placeholder={defaultValues?.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword', { setValueAs: value => defaultStringValue(value, undefined) })}
        />
      </FlexWrap>
    </div>
  )
}
