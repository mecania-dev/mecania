import { Metadata } from 'next'

import { Addresses } from '.'

export const metadata: Metadata = {
  title: 'Endereços'
}

export default function Page() {
  return (
    <div className="p-5">
      <Addresses />
    </div>
  )
}
