'use client'

import { Form } from '@/components/form'
import { useForm } from '@/hooks/use-form'
import { api } from '@/lib/api'
import { useUser } from '@/providers/user-provider'
import { User, UserUpdateInput, UserUpdateOutput, userUpdateSchema } from '@/types/entities/user'
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
    if (!(userUpdate instanceof FormData)) {
      delete userUpdate.avatarUrl
    }

    const res = await api.patch<User>(`users/${user?.id}/`, userUpdate, { raiseToast: true })
    if (res.ok) {
      form.reset(getDefaultValues(res.data))
    }
  }

  return (
    <Form form={form} className="space-y-4" onSubmit={onSubmit as any}>
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
