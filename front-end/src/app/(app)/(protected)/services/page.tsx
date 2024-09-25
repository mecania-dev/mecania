import { Metadata } from 'next'

import { ServicesTable } from './services-table'

export const metadata: Metadata = {
  title: 'Serviços'
}

export default async function Page() {
  return (
    <div className="p-5">
      <ServicesTable />
    </div>
  )
}
