import { auth } from '@/auth'
import { Metadata } from 'next'

import { MechanicForm } from './register-form'

export const metadata: Metadata = {
  title: 'Cadastrar Oficinas'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', admin: true })
  if (!isAuthorized) return null

  return (
    <div className="p-5 lg:px-[10%] xl:px-[15%]">
      <MechanicForm />
    </div>
  )
}
