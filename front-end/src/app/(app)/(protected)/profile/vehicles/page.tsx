import { auth } from '@/auth'
import { Metadata } from 'next'

import { VehiclesTable } from './vehicles-table'

export const metadata: Metadata = {
  title: 'Veículos'
}

export default async function Page() {
  await auth({ redirectUrl: '/profile', groups: ['Driver'] })

  return (
    <div className="p-5">
      <VehiclesTable />
    </div>
  )
}
