import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', app: 'fit-check', timestamp: new Date().toISOString() })
}
