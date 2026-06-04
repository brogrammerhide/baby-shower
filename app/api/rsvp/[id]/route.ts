import { NextRequest, NextResponse } from 'next/server';
import { deleteRSVP } from '../../services/rsvpService';
import { checkAuth } from '../../services/authService';

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
    const deleted = await deleteRSVP(id);
    if (!deleted) {
      return NextResponse.json({ error: 'RSVP profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'RSVP profile deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete RSVP' },
      { status: 500 }
    );
  }
}
