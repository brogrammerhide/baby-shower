import { NextRequest, NextResponse } from 'next/server';
import { getDetails, updateDetails } from '../services/detailsService';
// import { checkAuth } from '../services/authService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const details = await getDetails();
    return NextResponse.json(details, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch details' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // 1. Authorize Admin
    // const admin = await checkAuth(req);
    // if (!admin) {
    //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    // }

    // 2. Parse and Validate Body
    const body = await req.json();
    if (!body.date || !body.theme || !body.place) {
      return NextResponse.json(
        { error: 'Missing required fields: date, theme, and place' },
        { status: 400 }
      );
    }

    // 3. Update Details
    const updated = await updateDetails({
      date: body.date.trim(),
      theme: body.theme.trim(),
      place: body.place.trim(),
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update details' },
      { status: 500 }
    );
  }
}
