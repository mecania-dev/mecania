import { useFormContext } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { ImageInput } from '@/components/input/image'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { UserUpdateInput } from '@/http'
import { defaultStringValue } from '@/lib/string'
import { useUser } from '@/providers/user-provider'

export function ProfileFormBody() {
  const { isMechanic } = useUser()
  const { watch, register, setValue, formState } = useFormContext<UserUpdateInput>()
  const { defaultValues, errors } = formState
  const values = watch()

  function setProfileImg(image: File) {
    setValue('avatarUrl', image ?? null, { shouldDirty: true })
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
        <Input
          label="Nome"
          value={values.firstName}
          placeholder={defaultValues?.firstName}
          errorMessage={errors.firstName?.message}
          {...register('firstName')}
        />
        {!isMechanic && (
          <Input
            label="Sobrenome"
            value={values.lastName}
            placeholder={defaultValues?.lastName}
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
          />
        )}
      </FlexWrap>
      <Input
        label="Nome de usuário"
        value={values.username}
        placeholder={defaultValues?.username}
        errorMessage={errors.username?.message}
        {...register('username')}
      />
      <Input
        label="Email"
        value={values.email}
        placeholder={defaultValues?.email}
        errorMessage={errors.email?.message}
        {...register('email')}
      />
      <PhoneNumberInput
        label="Telefone"
        value={values.phoneNumber}
        placeholder={defaultValues?.phoneNumber}
        errorMessage={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />
      <FiscalIdentificationInput
        type={isMechanic ? 'CNPJ' : 'CPF'}
        label={isMechanic ? 'CNPJ' : 'CPF'}
        value={values.fiscalIdentification}
        placeholder={defaultValues?.fiscalIdentification}
        errorMessage={errors.fiscalIdentification?.message}
        {...register('fiscalIdentification')}
      />
      <PasswordInput
        label="Senha"
        value={values.password ?? ''}
        placeholder={defaultValues?.password}
        errorMessage={errors.password?.message}
        autoComplete="new-password"
        {...register('password', { setValueAs: value => defaultStringValue(value, undefined) })}
      />
      <PasswordInput
        label="Confirme a Senha"
        value={values.confirmPassword ?? ''}
        placeholder={defaultValues?.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        {...register('confirmPassword', { setValueAs: value => defaultStringValue(value, undefined) })}
      />
    </div>
  )
}
