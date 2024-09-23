import { auth } from '@/auth'
import { Metadata } from 'next'

import { AddressesTable } from './addresses-table'

export const metadata: Metadata = {
  title: 'Endereços'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', groups: ['Mechanic'] })
  if (!isAuthorized) return null

  return (
    <div className="p-5">
      <AddressesTable />
    </div>
  )
}
