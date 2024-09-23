import { auth } from '@/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastrar Oficinas'
}

export default async function Page() {
  const isAuthorized = await auth({ redirectUrl: '/profile', admin: true })
  if (!isAuthorized) return null

  return (
    <div className="p-5">
      <h1>Cadastrar Oficinas</h1>
    </div>
  )
}
