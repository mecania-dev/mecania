import { Button } from '@/components/button'
import { Logo } from '@/components/icons/logo'
import Link from 'next/link'

export function NewChatButton() {
  return (
    <Button as={Link} href="/chat" variant="flat" className="w-full shrink-0 items-center">
      <Logo className="animate-[spin_4s_linear_infinite]" />
      <p className="whitespace-nowrap font-semibold">Novo chat</p>
    </Button>
  )
}
