import { NextResponse } from 'next/server';
import { getDietaryOptions } from '../services/dietaryService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await getDietaryOptions();
    return NextResponse.json(options, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dietary options' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Dietary options are static. Dietary selections are stored on each RSVP.' },
    { status: 405 }
  );
}
