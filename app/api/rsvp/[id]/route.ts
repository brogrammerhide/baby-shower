import { NextRequest, NextResponse } from 'next/server';
import { deleteRSVP } from '../../services/rsvpService';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteRSVP(id);
    if (!deleted) {
      return NextResponse.json({ error: 'RSVP profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'RSVP profile deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete RSVP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
