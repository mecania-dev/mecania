import { Metadata } from 'next'

import { MechanicForm } from './register-form'
import { RegisterMechanicsList } from './register-mechanics-list'

export const metadata: Metadata = {
  title: 'Cadastrar Oficinas'
}

export default async function Page() {
  return (
    <div className="space-y-4 p-5 lg:px-[10%] xl:px-[15%]">
      <MechanicForm />
      <RegisterMechanicsList />
    </div>
  )
}
