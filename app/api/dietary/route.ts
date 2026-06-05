import { NextRequest, NextResponse } from 'next/server';
import { getDietaryOptions, createDietaryOption } from '../services/dietaryService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await getDietaryOptions();
    return NextResponse.json(options, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dietary options' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.key || !body.label) {
      return NextResponse.json(
        { error: 'Missing required fields: key and label' },
        { status: 400 }
      );
    }

    const option = await createDietaryOption({
      key: body.key,
      label: body.label,
      icon: body.icon,
    });

    return NextResponse.json(option, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create dietary option' },
      { status: 500 }
    );
  }
}
