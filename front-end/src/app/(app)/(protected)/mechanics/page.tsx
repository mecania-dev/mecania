import { Metadata } from 'next'

import { MechanicsList } from '.'

export const metadata: Metadata = {
  title: 'Oficinas'
}

export default async function Page() {
  return <MechanicsList />
}
