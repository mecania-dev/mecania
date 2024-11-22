'use client'

import { Button } from '@/components/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center bg-gradient-to-b from-primary-50 via-white to-primary-100 text-default-800">
      <main className="mt-16 flex flex-col items-center space-y-8 px-5 text-center md:px-10">
        <h1 className="text-4xl font-bold leading-tight text-primary md:text-6xl">
          Bem-vindo ao{' '}
          <span className="text-secondary">
            MECAN<span className="text-primary">IA</span>
          </span>
        </h1>
        <p className="max-w-3xl text-lg text-default-600 md:text-xl">
          O app que conecta motoristas a mecânicos de confiança e simplifica a manutenção do seu veículo.
        </p>
        <Button as={Link} radius="full" size="lg" color="secondary" href="/sign-in">
          Explore Agora
        </Button>
      </main>
    </div>
  )
}
