import { auth } from '@/auth'
import { Metadata } from 'next'

import { MechanicForm } from './register-form'
import { RegisterMechanicsList } from './register-mechanics-list'

export const metadata: Metadata = {
  title: 'Cadastrar Oficinas'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', admin: true })
  if (!isAuthorized) return null

  return (
    <div className="space-y-4 p-5 lg:px-[10%] xl:px-[15%]">
      <MechanicForm />
      <RegisterMechanicsList />
    </div>
  )
}
