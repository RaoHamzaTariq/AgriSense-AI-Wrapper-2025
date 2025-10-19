import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the JSON body from the incoming request
    const body = await request.json();

    // Forward the message body to the FastAPI backend /chat endpoint
    const apiResponse = await fetch(`${process.env.FASTAPI_BACKEND_URL}/chat?query=${body.message}`);

    // If the FastAPI backend did not return a successful response
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('FastAPI backend returned error:', errorText);
      return NextResponse.json(
        { error: 'Backend error', details: errorText },
        { status: apiResponse.status }
      );
    }

    // Parse the result from FastAPI backend and forward it
    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
