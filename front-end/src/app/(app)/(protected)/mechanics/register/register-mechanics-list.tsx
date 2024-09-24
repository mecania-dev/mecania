'use client'

import { Button } from '@/components/button'
import { useIsLoading } from '@/hooks/use-is-loading'
import { createMechanic } from '@/http/user/create-mechanic'

import { NewMechanicCard } from './register-form/new-mechanic-card'
import { useRegisterMechanics } from './register-form/use-register-mechanics'

export function RegisterMechanicsList() {
  const { mechanics, removeMechanic } = useRegisterMechanics()
  const [onRegisterMechanics, isLoading] = useIsLoading(async () => {
    for (const mechanic of mechanics) {
      const res = await createMechanic(mechanic)
      if (res.ok) {
        removeMechanic(mechanics.indexOf(mechanic))
      }
    }
  })

  if (mechanics.length === 0) return null

  return (
    <div className="space-y-4">
      <Button onPress={onRegisterMechanics} isLoading={isLoading}>
        Cadastrar oficinas
      </Button>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mechanics.map((mechanic, index) => (
          <NewMechanicCard index={index} mechanic={mechanic} key={index} />
        ))}
      </div>
    </div>
  )
}
