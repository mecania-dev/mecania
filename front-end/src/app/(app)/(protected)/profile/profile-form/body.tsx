import { useFormContext } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { Input } from '@/components/input'
import { FiscalIdentificationInput } from '@/components/input/fiscal-identification'
import { ImageInput } from '@/components/input/image'
import { PasswordInput } from '@/components/input/password'
import { PhoneNumberInput } from '@/components/input/phone-number'
import { defaultStringValue } from '@/lib/string'
import { useUser } from '@/providers/user-provider'
import { UserUpdateInput } from '@/types/entities/user'

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
          wrapper: 'w-[min(400px,_100%)]',
          innerWrapper: 'aspect-[4/3]',
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
          autoComplete="off"
          {...register('firstName')}
        />
        {!isMechanic && (
          <Input
            label="Sobrenome"
            value={values.lastName}
            placeholder={defaultValues?.lastName}
            errorMessage={errors.lastName?.message}
            autoComplete="off"
            {...register('lastName')}
          />
        )}
      </FlexWrap>
      <Input
        label="Nome de usuário"
        value={values.username}
        placeholder={defaultValues?.username}
        errorMessage={errors.username?.message}
        autoComplete="off"
        {...register('username')}
      />
      <Input
        label="Email"
        value={values.email}
        placeholder={defaultValues?.email}
        errorMessage={errors.email?.message}
        autoComplete="off"
        {...register('email')}
      />
      <PhoneNumberInput
        label="Telefone"
        value={values.phoneNumber}
        placeholder={defaultValues?.phoneNumber}
        errorMessage={errors.phoneNumber?.message}
        autoComplete="off"
        {...register('phoneNumber')}
      />
      <FiscalIdentificationInput
        type={isMechanic ? 'CNPJ' : 'CPF'}
        label={isMechanic ? 'CNPJ' : 'CPF'}
        value={values.fiscalIdentification}
        placeholder={defaultValues?.fiscalIdentification}
        errorMessage={errors.fiscalIdentification?.message}
        autoComplete="off"
        {...register('fiscalIdentification')}
      />
      <PasswordInput
        label="Senha"
        value={values.password ?? ''}
        placeholder={defaultValues?.password}
        errorMessage={errors.password?.message}
        autoComplete="off"
        {...register('password', { setValueAs: value => defaultStringValue(value, undefined) })}
      />
      <PasswordInput
        label="Confirme a Senha"
        value={values.confirmPassword ?? ''}
        placeholder={defaultValues?.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        autoComplete="off"
        {...register('confirmPassword', { setValueAs: value => defaultStringValue(value, undefined) })}
      />
    </div>
  )
}
