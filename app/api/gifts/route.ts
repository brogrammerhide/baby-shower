import { NextRequest, NextResponse } from 'next/server';
import { getAllGifts, createGift } from '../services/giftService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const gifts = await getAllGifts(category);
    return NextResponse.json(gifts, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gifts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.category || !body.price || !body.icon) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, and icon' },
        { status: 400 }
      );
    }

    const gift = await createGift({
      name: body.name.trim(),
      category: body.category.toLowerCase().trim(),
      price: body.price.trim(),
      icon: body.icon.trim(),
      note: body.note?.trim() || '',
      url: body.url?.trim() || '',
      imageUrl: body.imageUrl?.trim() || '',
    });

    return NextResponse.json(gift, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create gift';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
