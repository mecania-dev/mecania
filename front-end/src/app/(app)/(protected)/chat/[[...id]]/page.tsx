import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Chat } from '.'

type Props = {
  params: { id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.id ? 'Chat' : 'Novo Chat'
  }
}

export default async function Page({ params }: Props) {
  const chatId = params.id ? Number(params.id.at(0)) : undefined
  const isValid = !params.id || !isNaN(params.id.at(0) as any)

  if (!isValid) redirect('/chat')

  return <Chat chatId={chatId} />
}
