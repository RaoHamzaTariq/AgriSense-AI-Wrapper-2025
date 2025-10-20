import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the JSON body from the incoming request
    const body = await request.json();

    // Prepare query parameters using message and user_id (email)
    const query = encodeURIComponent(body.message);
    const userId = encodeURIComponent(body.email); // assuming email is present in body

    // Forward the message body and user_id to the FastAPI backend /chat endpoint
    const apiUrl = `${process.env.FASTAPI_BACKEND_URL}/chat?query=${query}&user_id=${userId}`;

    const apiResponse = await fetch(apiUrl);

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
