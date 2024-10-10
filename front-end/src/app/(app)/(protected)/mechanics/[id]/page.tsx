import { getUser } from '@/http'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { MechanicDetails } from '.'

type Props = {
  params: { id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await getUser(Number(params.id))
  if (res.status === 404) return notFound()
  if (!res.ok) return redirect('/profile')
  return {
    title: res.data.username
  }
}

export default async function Page({ params }: Props) {
  const res = await getUser(Number(params.id))
  if (!res.ok) return notFound()

  return <MechanicDetails id={res.data.id} />
}
