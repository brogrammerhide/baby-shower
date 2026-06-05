import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs, submitRSVP } from '../services/rsvpService';
// import { checkAuth } from '../services/authService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // const admin = await checkAuth(req);
    // if (!admin) {
    //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    // }

    const rsvps = await getAllRSVPs();
    return NextResponse.json(rsvps, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch RSVPs' },
      { status: 500 }
    );
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

    const rsvp = await submitRSVP({
      firstName: body.firstName,
      lastName: body.lastName,
      attending: body.attending,
      guests: Number(body.guests) || 1,
      diet: body.diet || [],
      otherDiet: body.otherDiet,
      arrivalTime: body.arrivalTime,
    });

    return NextResponse.json(rsvp, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
