import { useFormContext } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { ImageInput } from '@/components/input/image'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { toast } from '@/hooks/use-toast'
import { CNPJApiResponse, getZipCode } from '@/http'
import { MechanicCreateInput } from '@/http/user/create-mechanic'
import { phoneNumberMask } from '@/lib/masks/phone-number'
import { CEPMask } from '@/lib/masks/zip-code'
import { defaultStringValue } from '@/lib/string'

export function MechanicFormBody() {
  const { watch, register, setValue, formState } = useFormContext<MechanicCreateInput>()
  const { defaultValues, errors } = formState
  const values = watch()

  function setProfileImg(image: File) {
    setValue('avatarUrl', image ?? undefined, { shouldDirty: true })
  }

  async function onCNPJChange(cnpj?: CNPJApiResponse) {
    if (cnpj?.razao_social) {
      setValue('firstName', cnpj.razao_social, { shouldValidate: true, shouldDirty: true })
    }

    if (cnpj?.nome_fantasia) {
      setValue('username', cnpj.nome_fantasia, { shouldValidate: true, shouldDirty: true })
    }

    if (cnpj?.ddd_telefone_1) {
      setValue('phoneNumber', phoneNumberMask(cnpj.ddd_telefone_1), { shouldValidate: true, shouldDirty: true })
    }

    if (cnpj?.cep && cnpj.numero) {
      const addressRes = await getZipCode(cnpj.cep)

      if (addressRes.ok) {
        const { street, neighborhood, city, state, cep } = addressRes.data

        if (street && neighborhood && city && state && cep) {
          setValue(
            'addresses',
            [
              {
                street: street,
                number: cnpj.numero,
                district: neighborhood,
                city: city,
                state: state,
                zipCode: CEPMask(cep),
                country: 'BR',
                complement: cnpj.complemento
              }
            ],
            { shouldValidate: true, shouldDirty: true }
          )
        }
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
      <ImageInput
        image={values.avatarUrl}
        label={values.username}
        classNames={{
          base: 'items-center mb-5',
          wrapper: 'w-[min(350px,_100%)]',
          innerWrapper: 'aspect-[5/3.5]',
          img: 'object-cover'
        }}
        setImage={setProfileImg}
      />
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
          {...register('rating', { setValueAs: value => (value ? Number(value) : undefined) })}
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
