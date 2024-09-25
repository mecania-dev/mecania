import { Metadata } from 'next'

import { MechanicsList } from '.'

export const metadata: Metadata = {
  title: 'Oficinas'
}

export default async function Page() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <MechanicsList />
    </div>
  )
}
