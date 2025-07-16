import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      return NextResponse.json(
        { error: data.message || 'Weather fetch failed' },
        { status: data.cod }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
