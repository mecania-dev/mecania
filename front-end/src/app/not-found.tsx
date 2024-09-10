import { Button } from '@/components/button'
import { Logo } from '@/components/icons/logo'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center space-y-4 p-5 text-center">
      <Logo className="h-auto w-24 animate-[spin_4s_linear_infinite]" />
      <div className="text-large font-semibold sm:text-2xl">Ops! Esta página não pôde ser encontrada.</div>
      <p className="!mb-4 text-default-600 sm:text-large">
        A página que você está procurando pode ter sido removida, alterado seu nome ou está temporariamente
        indisponível.
      </p>
      <Button as={Link} href="/" size="lg" color="danger" variant="shadow" className="font-semibold hover:scale-105">
        Voltar para a página inicial
      </Button>
    </div>
  )
}
