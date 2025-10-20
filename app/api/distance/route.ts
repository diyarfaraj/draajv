import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')

  if (!origin || !destination) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&language=sv`

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Distance API error:', error)
    return NextResponse.json({ error: 'Failed to fetch distance' }, { status: 500 })
  }
}
