import { NextRequest, NextResponse } from 'next/server';
import { lookupRSVP } from '../../services/rsvpService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.firstName) {
      return NextResponse.json(
        { error: 'Missing required field: firstName' },
        { status: 400 }
      );
    }

    const result = await lookupRSVP(body.firstName, body.lastName);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to lookup RSVP' },
      { status: 500 }
    );
  }
}
