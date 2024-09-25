import { Metadata } from 'next'

import { AddressesTable } from './addresses-table'

export const metadata: Metadata = {
  title: 'Endereços'
}

export default async function Page() {
  return (
    <div className="p-5">
      <AddressesTable />
    </div>
  )
}
