'use client'

import { DefaultValues } from 'react-hook-form'

import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { useForm } from '@/hooks/use-form'
import {
  createMechanic,
  MechanicCreateInput,
  MechanicCreateOutput,
  mechanicCreateSchema
} from '@/http/user/create-mechanic'
import { zodResolver } from '@hookform/resolvers/zod'

import { MechanicFormBody } from './body'
import { MechanicFormFooter } from './footer'
import { NewMechanicCard } from './new-mechanic-card'
import { useRegisterMechanics } from './use-register-mechanics'

export function MechanicForm() {
  const { mechanics, addMechanic, removeMechanic } = useRegisterMechanics()
  const form = useForm<MechanicCreateInput>({
    resolver: zodResolver(mechanicCreateSchema),
    defaultValues: getDefaultValues()
  })

  function onAddMechanic(mechanicCreate: MechanicCreateOutput) {
    addMechanic(mechanicCreate)
    form.reset(getDefaultValues())
  }

  async function onRegisterMechanics() {
    for (const mechanic of mechanics) {
      const res = await createMechanic(mechanic)
      if (res.ok) {
        removeMechanic(mechanics.indexOf(mechanic))
      }
    }
  }

  return (
    <Form form={form} className="space-y-4" onSubmit={onAddMechanic as any} autoComplete="off">
      <MechanicFormBody />
      <MechanicFormFooter />
      {mechanics.length > 0 && (
        <>
          <Button onPress={onRegisterMechanics}>Cadastrar oficinas</Button>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mechanics.map((mechanic, index) => (
              <NewMechanicCard index={index} mechanic={mechanic} key={index} />
            ))}
          </div>
        </>
      )}
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
