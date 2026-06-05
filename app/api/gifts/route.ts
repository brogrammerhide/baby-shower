import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs } from '../services/rsvpService';
import { DEFAULT_GIFTS } from '../../../app/lib/defaults';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const rsvpId = searchParams.get('rsvpId') || undefined;

    const rsvps = await getAllRSVPs();
    const reservationCounts: Record<string, number> = {};
    const personalReservations = new Set<string>();

    for (const rsvp of rsvps) {
      if (rsvp.reservedGifts) {
        for (const giftId of rsvp.reservedGifts) {
          reservationCounts[giftId] = (reservationCounts[giftId] || 0) + 1;
          if (rsvpId && rsvp.id === rsvpId) {
            personalReservations.add(giftId);
          }
        }
      }
    }

    let gifts = DEFAULT_GIFTS.map((gift) => ({
      ...gift,
      reserved: gift.id ? personalReservations.has(gift.id) : false,
      reservedCount: gift.id ? (reservationCounts[gift.id] || 0) : 0,
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
