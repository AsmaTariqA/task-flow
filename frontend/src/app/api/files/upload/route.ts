// app/api/files/upload/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()

  console.log('Proxy received formData:')
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const text = await res.text()
  console.log('Backend response:', text)

  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
