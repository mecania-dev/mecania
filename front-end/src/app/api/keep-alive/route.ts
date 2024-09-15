import { api } from '@/http'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const res = await api.get('keep-alive', { raw: true })

  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(res.data, { status: res.status })
}
