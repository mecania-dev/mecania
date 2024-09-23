import { auth } from '@/auth'
import { Metadata } from 'next'

import { MechanicsList } from '.'

export const metadata: Metadata = {
  title: 'Oficinas'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', admin: true })
  if (!isAuthorized) return null

  return <MechanicsList />
}
