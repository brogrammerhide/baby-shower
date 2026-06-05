import { NextRequest, NextResponse } from 'next/server';
import { getAllGifts } from '../services/giftService';
// import { getAllGifts, createGift } from '../services/giftService';
// import { checkAuth } from '../services/authService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const gifts = await getAllGifts(category);
    return NextResponse.json(gifts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}

// POST endpoint disabled - gifts endpoint is read-only
// export async function POST(req: NextRequest) {
//   try {
//     // const admin = await checkAuth(req);
//     // if (!admin) {
//     //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
//     // }
//
//     const body = await req.json();
//     if (!body.name || !body.category || !body.price || !body.icon) {
//       return NextResponse.json(
//         { error: 'Missing required fields: name, category, price, and icon' },
//         { status: 400 }
//       );
//     }
//
//     const gift = await createGift({
//       name: body.name.trim(),
//       category: body.category.toLowerCase().trim(),
//       price: body.price.trim(),
//       icon: body.icon.trim(),
//       note: body.note?.trim() || '',
//       url: body.url?.trim() || '',
//       imageUrl: body.imageUrl?.trim() || '',
//     });
//
//     return NextResponse.json(gift, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to create gift' },
//       { status: 500 }
//     );
//   }
// }
