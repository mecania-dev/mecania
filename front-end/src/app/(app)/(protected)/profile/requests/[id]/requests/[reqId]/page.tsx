import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { MechanicRequest } from '.'

type Props = {
  params: { id?: string; reqId?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Solicitações'
}

export default function Page({ params }: Props) {
  if (!isValid(params.id) || !isValid(params.reqId)) redirect('/profile')

  return <MechanicRequest mechanicId={Number(params.id)} requestId={Number(params.reqId)} />
}

function isValid(value?: string | string[]) {
  return value && !isNaN(value as any)
}
