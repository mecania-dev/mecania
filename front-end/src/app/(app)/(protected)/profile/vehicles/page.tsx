import { Metadata } from 'next'

import { VehiclesTable } from './vehicles-table'

export const metadata: Metadata = {
  title: 'Veículos'
}

export default async function Page() {
  return (
    <div className="p-5">
      <VehiclesTable />
    </div>
  )
}
