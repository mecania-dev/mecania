import { auth } from '@/auth'
import { Metadata } from 'next'

import { VehiclesTable } from './vehicles-table'

export const metadata: Metadata = {
  title: 'Veículos'
}

export default async function Page() {
  const isAuthenticated = await auth({ redirectUrl: '/profile', groups: ['Driver'] })
  if (!isAuthenticated) return null

  return (
    <div className="p-5">
      <VehiclesTable />
    </div>
  )
}
