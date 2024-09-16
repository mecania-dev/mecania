import { api } from '@/http'
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await api.get('keep-alive', { raw: true })
  return NextResponse.json(res.data, { status: res.status })
}
