import { NextRequest, NextResponse } from 'next/server';
import { getRSVPById, updateReservedGifts } from '../../../services/rsvpService';
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

    // Check if anonymous
    const isAnonymous = rsvpId.includes(':anon:') || rsvpId.startsWith('anon:');
    
    if (isAnonymous) {
      // For anonymous users, we just update the gift count
      // We can't easily check if they already reserved it on the server, 
      // but the client-side handles optimistic state and double-click prevention.
      await updateReservedGifts(rsvpId, [], id, action);
    } else {
      const rsvp = await getRSVPById(rsvpId);
      if (!rsvp) {
         // If it's not anonymous but also not found, treat as error or fallback to anonymous-like behavior
         await updateReservedGifts(rsvpId, [], id, action);
      } else {
        const existingReserved = rsvp.reservedGifts || [];
        if (action === 'reserve') {
          if (!existingReserved.includes(id)) {
            await updateReservedGifts(rsvpId, [...existingReserved, id], id, 'reserve');
          }
        } else {
          await updateReservedGifts(
            rsvpId,
            existingReserved.filter((giftId: string) => giftId !== id),
            id,
            'release'
          );
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update gift reservation' },
      { status: 500 }
    );
  }
}
