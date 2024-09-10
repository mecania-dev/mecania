import { Metadata } from 'next'

import { SignUpForm } from './sign-up-form'

export const metadata: Metadata = {
  title: 'Registrar'
}

export default function Page() {
  return <SignUpForm />
}
