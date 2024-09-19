'use client'

import { Form } from '@/components/form'
import { setFormErrors, useForm } from '@/hooks/use-form'
import { updateUser, userUpdateFields, UserUpdateInput, UserUpdateOutput, userUpdateSchema } from '@/http'
import { useUser } from '@/providers/user-provider'
import { User } from '@/types/entities/user'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProfileFormBody } from './body'
import { ProfileFormFooter } from './footer'

export function ProfileForm() {
  const { user } = useUser()
  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: getDefaultValues(user)
  })

  async function onSubmit(userUpdate: UserUpdateOutput) {
    await updateUser(user!.id, userUpdate, {
      onSuccess(res) {
        form.reset(getDefaultValues(res.data))
      },
      onError(error) {
        setFormErrors(form, error?.response?.data, userUpdateFields)
      }
    })
  }

  return (
    <Form form={form} className="space-y-4" onSubmit={onSubmit as any} autoComplete="off">
      <ProfileFormBody />
      <ProfileFormFooter />
    </Form>
  )
}

function getDefaultValues(user?: User): UserUpdateInput {
  return {
    username: user?.username,
    email: user?.email,
    avatarUrl: user?.avatarUrl,
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber,
    fiscalIdentification: user?.fiscalIdentification,
    isSuperuser: user?.isSuperuser,
    isStaff: user?.isStaff,
    isActive: user?.isActive
  }
}
