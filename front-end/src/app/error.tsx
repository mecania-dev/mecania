'use client'

import { Button } from '@/components/button'
import { Logo } from '@/components/icons/logo'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string; code?: number }
  reset: () => void
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="flex grow flex-col items-center justify-center space-y-4 p-5 text-center">
      <Logo className="h-auto w-24 animate-[spin_4s_linear_infinite]" />
      <div className="text-large font-semibold sm:text-2xl">Ops! Algo deu errado.</div>
      <div className="!mb-4 space-y-2">
        <p className="text-default-600 sm:text-large">
          Ocorreu um problema inesperado. Por favor, tente novamente mais tarde.
        </p>
        {error.message && <p className="text-sm text-danger">Erro: {error.message}</p>}
      </div>
      <Button as={Link} href="/" size="lg" color="danger" variant="shadow" className="font-semibold hover:scale-105">
        Voltar para a página inicial
      </Button>
    </div>
  )
}
