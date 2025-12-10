import { NextRequest, NextResponse } from 'next/server';

// GET /api/planning - Retrieve planning from localStorage (client-side only)
export async function GET() {
  return NextResponse.json({
    message: 'Use localStorage on the client side to retrieve planning data',
    key: 'bourgo_arena_planning',
  });
}

// POST /api/planning - Save planning (could be extended for server-side storage)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the data structure
    if (!data.sports_complex || !data.planning || !Array.isArray(data.planning)) {
      return NextResponse.json(
        { error: 'Invalid planning data structure' },
        { status: 400 }
      );
    }

    // In a real application, you would save this to a database
    // For now, we return success and let the client handle localStorage
    return NextResponse.json({
      success: true,
      message: 'Planning data validated successfully',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process planning data', details: String(error) },
      { status: 500 }
    );
  }
}
