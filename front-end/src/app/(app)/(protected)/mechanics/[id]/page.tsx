import { auth } from '@/auth'
import { getUser } from '@/http'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MechanicDetails } from '.'

type Props = {
  params: { id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await getUser(Number(params.id))
  if (!res.ok) return notFound()
  return {
    title: `Oficina ${res.data.username}`
  }
}

export default async function Page({ params }: Props) {
  const isAuthorized = await auth({ redirectUrl: '/profile' })
  if (!isAuthorized) return null

  const res = await getUser(Number(params.id))
  if (!res.ok) return notFound()

  return <MechanicDetails id={res.data.id} />
}
