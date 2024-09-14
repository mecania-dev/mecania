import { auth } from '@/auth'
import { Metadata } from 'next'

import { Addresses } from '.'

export const metadata: Metadata = {
  title: 'Endereços'
}

export default async function Page() {
  await auth({ redirectUrl: '/profile', groups: ['Mechanic'] })

  return (
    <div className="p-5">
      <Addresses />
    </div>
  )
}
