import { Metadata } from 'next'

import { ForgotPassword } from '.'

export const metadata: Metadata = {
  title: 'Esqueci a senha'
}

export default function Page() {
  return <ForgotPassword />
}
