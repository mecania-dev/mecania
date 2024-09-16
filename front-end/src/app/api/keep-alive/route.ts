import { api } from '@/http'
import { unstable_noStore as noStore } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  noStore()
  const res = await api.get('keep-alive', { raw: true })
  return NextResponse.json(res.data, { status: res.status })
}
