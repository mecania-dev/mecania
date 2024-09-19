'use client'

import { Form } from '@/components/form'
import { setFormErrors, useForm } from '@/hooks/use-form'
import { signUpFields, SignUpRequest, signUpSchema } from '@/http'
import { useUser } from '@/providers/user-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { SignUpFormBody } from './sign-up-form-body'
import { SignUpFormFooter } from './sign-up-form-footer'

export function SignUpForm() {
  const { signUp } = useUser()
  const form = useForm<SignUpRequest>({ resolver: zodResolver(signUpSchema), defaultValues: { groups: ['Driver'] } })

  async function onSubmit(props: SignUpRequest) {
    await signUp(props, {
      onError(error) {
        setFormErrors(form, error?.response?.data, signUpFields)
      }
    })
  }

  return (
    <Form form={form} className="w-full max-w-sm grow space-y-4" onSubmit={onSubmit}>
      <SignUpFormBody />
      <SignUpFormFooter />
      <p className="text-center text-sm font-medium">
        Já tem uma conta?{' '}
        <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-500 hover:underline">
          Entrar
        </Link>
      </p>
    </Form>
  )
}
