import { auth } from '@/auth'
import { Metadata } from 'next'

import { Addresses } from '.'

export const metadata: Metadata = {
  title: 'Endereços'
}

export default async function Page() {
  const isAuthenticated = await auth({ redirectUrl: '/profile', groups: ['Mechanic'] })
  if (!isAuthenticated) return null

  return (
    <div className="p-5">
      <Addresses />
    </div>
  )
}
