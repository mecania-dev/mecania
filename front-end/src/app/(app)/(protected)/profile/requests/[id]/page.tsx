import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { MechanicRequest } from '.'

type Props = {
  params: { id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Solicitações'
}

export default function Page({ params }: Props) {
  if (!isValid(params.id)) redirect('/profile')

  return <MechanicRequest id={Number(params.id)} />
}

function isValid(value?: string | string[]) {
  return value && !isNaN(value as any)
}
