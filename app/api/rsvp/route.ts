import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs, submitRSVP } from '../services/rsvpService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rsvps = await getAllRSVPs();
    return NextResponse.json(rsvps, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch RSVPs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.firstName || !body.lastName || body.attending === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, and attending' },
        { status: 400 }
      );
    }

    const attending = Boolean(body.attending);
    const guests = attending ? Math.max(1, Number(body.guests) || 1) : 0;

    const rsvp = await submitRSVP({
      firstName: body.firstName,
      lastName: body.lastName,
      attending,
      guests,
      diet: body.diet || [],
      otherDiet: body.otherDiet,
      estimateArrivalTime: body.estimateArrivalTime,
      allowUpdate: Boolean(body.allowUpdate),
    });

    return NextResponse.json(rsvp, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit RSVP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
