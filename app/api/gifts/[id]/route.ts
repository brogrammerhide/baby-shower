import { NextRequest, NextResponse } from 'next/server';
import { updateGift, deleteGift } from '../../services/giftService';
import { checkAuth } from '../../services/authService';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const gift = await updateGift(id, body);
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json(gift, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update gift' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteGift(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gift deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete gift' },
      { status: 500 }
    );
  }
}
