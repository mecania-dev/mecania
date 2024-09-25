'use client'

import { DefaultValues } from 'react-hook-form'

import { Form } from '@/components/form'
import { useForm } from '@/hooks/use-form'
import { MechanicCreateInput, MechanicCreateOutput, mechanicCreateSchema } from '@/http'
import { zodResolver } from '@hookform/resolvers/zod'

import { MechanicFormBody } from './body'
import { MechanicFormFooter } from './footer'
import { useRegisterMechanics } from './use-register-mechanics'

export function MechanicForm() {
  const { addMechanic } = useRegisterMechanics()
  const form = useForm<MechanicCreateInput>({
    resolver: zodResolver(mechanicCreateSchema),
    defaultValues: getDefaultValues()
  })

  function onAddMechanic(mechanicCreate: MechanicCreateOutput) {
    addMechanic(mechanicCreate)
    form.reset(getDefaultValues())
  }

  return (
    <Form form={form} className="space-y-4" onSubmit={onAddMechanic as any} autoComplete="off">
      <MechanicFormBody />
      <MechanicFormFooter />
    </Form>
  )
}

function getDefaultValues(): DefaultValues<MechanicCreateInput> {
  return {
    username: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    fiscalIdentification: '',
    rating: 1,
    password: '123123123',
    confirmPassword: '123123123'
  }
}
