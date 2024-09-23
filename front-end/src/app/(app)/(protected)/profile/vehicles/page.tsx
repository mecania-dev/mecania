import { auth } from '@/auth'
import { Metadata } from 'next'

import { VehiclesTable } from './vehicles-table'

export const metadata: Metadata = {
  title: 'Veículos'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', groups: ['Driver'] })
  if (!isAuthorized) return null

  return (
    <div className="p-5">
      <VehiclesTable />
    </div>
  )
}
