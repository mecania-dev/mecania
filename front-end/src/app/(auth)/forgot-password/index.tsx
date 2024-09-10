'use client'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/button'
import { Form } from '@/components/form'
import { Input } from '@/components/input'
import { ForgotPasswordRequest, forgotPasswordSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

export function ForgotPassword() {
  const form = useForm<ForgotPasswordRequest>({ resolver: zodResolver(forgotPasswordSchema) })
  const { register } = form
  const { errors, isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit({ email }: ForgotPasswordRequest) {
    console.log(email)
  }

  return (
    <Form form={form} className="w-full max-w-sm space-y-4" onSubmit={onSubmit}>
      <Input
        label="E-mail"
        variant="underlined"
        placeholder="exemplo@exemplo.com"
        description={
          isSubmitSuccessful
            ? 'Se o e-mail estiver registrado, um e-mail de redefinição de senha será enviado.'
            : 'Por favor, insira seu endereço de e-mail para redefinir sua senha.'
        }
        errorMessage={errors.email?.message}
        isReadOnly={isSubmitting || isSubmitSuccessful}
        {...register('email')}
      />
      <Link href="/sign-in" className="block text-sm text-indigo-600 hover:text-indigo-500 hover:underline">
        Voltar para o login
      </Link>
      <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitSuccessful}>
        {isSubmitSuccessful ? 'Redefinição enviada!' : 'Redefinir senha'}
      </Button>
    </Form>
  )
}
