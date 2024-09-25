import { Metadata } from 'next'

import { ServicesPage } from '.'

export const metadata: Metadata = {
  title: 'Serviços'
}

export default function Page() {
  return <ServicesPage />
}
