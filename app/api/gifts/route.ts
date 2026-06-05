import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs } from '../services/rsvpService';
import { DEFAULT_GIFTS } from '../../../app/lib/defaults';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const rsvps = await getAllRSVPs();
    const reservedSet = new Set<string>();

    for (const rsvp of rsvps) {
      if (rsvp.reservedGifts) {
        for (const giftId of rsvp.reservedGifts) {
          reservedSet.add(giftId);
        }
      }
    }

    let gifts = DEFAULT_GIFTS.map((gift) => ({
      ...gift,
      reserved: gift.id ? reservedSet.has(gift.id) : false,
    }));

    if (category) {
      const catLower = category.toLowerCase().trim();
      gifts = gifts.filter((gift) => gift.category.toLowerCase() === catLower);
    }

    return NextResponse.json(gifts, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gifts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
