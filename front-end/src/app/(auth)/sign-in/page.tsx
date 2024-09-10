import { Metadata } from 'next'

import { SignInForm } from './sign-in-form'

export const metadata: Metadata = {
  title: 'Login'
}

export default function Page() {
  return <SignInForm />
}
