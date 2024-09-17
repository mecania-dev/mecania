import { auth } from '@/auth'
import { Metadata } from 'next'

import { ServicesTable } from './services-table'

export const metadata: Metadata = {
  title: 'Serviços'
}

export default async function Page() {
  const isAuthenticated = await auth({ redirectUrl: '/profile', admin: true })
  if (!isAuthenticated) return null

  return (
    <div className="p-5">
      <ServicesTable />
    </div>
  )
}
