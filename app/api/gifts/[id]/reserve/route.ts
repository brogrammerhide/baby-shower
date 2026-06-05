import { NextRequest, NextResponse } from 'next/server';
import { getRSVPById, getRSVPsWithReservedGift, updateReservedGifts } from '../../../services/rsvpService';
import { DEFAULT_GIFTS } from '../../../../../app/lib/defaults';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.rsvpId || !body.action || !['reserve', 'release'].includes(body.action)) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: rsvpId and action ("reserve" | "release")' },
        { status: 400 }
      );
    }

    const { rsvpId, action } = body;

    // Verify the gift actually exists in defaults.ts
    const giftExists = DEFAULT_GIFTS.some((g) => g.id === id);
    if (!giftExists) {
      return NextResponse.json({ error: 'Gift not found in registry' }, { status: 404 });
    }

    const rsvp = await getRSVPById(rsvpId);
    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP profile not found' }, { status: 404 });
    }

    if (action === 'reserve') {
      if (!rsvp.attending) {
        return NextResponse.json({ error: 'Only attending guests can reserve gifts' }, { status: 400 });
      }

      const matchingRsvps = await getRSVPsWithReservedGift(id);
      const alreadyReserved = matchingRsvps.some((match) => match.id !== rsvpId);

      if (alreadyReserved) {
        return NextResponse.json(
          { error: 'This gift has already been reserved by another guest' },
          { status: 400 }
        );
      }

      const existingReserved = rsvp.reservedGifts || [];
      if (!existingReserved.includes(id)) {
        await updateReservedGifts(rsvpId, [...existingReserved, id]);
      }
    } else {
      const existingReserved = rsvp.reservedGifts || [];
      await updateReservedGifts(
        rsvpId,
        existingReserved.filter((giftId: string) => giftId !== id)
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update gift reservation' },
      { status: 500 }
    );
  }
}
