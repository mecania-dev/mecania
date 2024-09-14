'use client'

import { Form } from '@/components/form'
import { useForm } from '@/hooks/use-form'
import { SignInRequest, signInSchema } from '@/http'
import { useUser } from '@/providers/user-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { SignInFormBody } from './sign-in-form-body'
import { SignInFormFooter } from './sign-in-form-footer'

export function SignInForm() {
  const { signIn } = useUser()
  const form = useForm<SignInRequest>({ resolver: zodResolver(signInSchema) })

  async function onSubmit(props: SignInRequest) {
    await signIn(props)
  }

  return (
    <Form form={form} className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
      <SignInFormBody />
      <Link href="/forgot-password" className="block text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
        Esqueceu a senha?
      </Link>
      <SignInFormFooter />
      <p className="text-center text-sm font-medium">
        Não tem uma conta?{' '}
        <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-500 hover:underline">
          Registrar
        </Link>
      </p>
    </Form>
  )
}
