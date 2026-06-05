// import { NextRequest, NextResponse } from 'next/server';
// import { reserveGift } from '../../../services/giftService';
//
// // PATCH endpoint disabled - gifts endpoint is read-only
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();
//
//     if (!body.rsvpId || !body.action || !['reserve', 'release'].includes(body.action)) {
//       return NextResponse.json(
//         { error: 'Missing or invalid required fields: rsvpId and action ("reserve" | "release")' },
//         { status: 400 }
//       );
//     }
//
//     const gift = await reserveGift(id, body.rsvpId, body.action);
//     return NextResponse.json(gift, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to update gift reservation' },
//       { status: 500 }
//     );
//   }
// }
