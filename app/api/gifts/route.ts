import { NextRequest, NextResponse } from 'next/server';
import { redis } from '../lib/upstashRedis';
import { getAllRSVPs, fetchRsvpDoc } from '../services/rsvpService';
import { DEFAULT_GIFTS } from '../../../app/lib/defaults';

export const dynamic = 'force-dynamic';

async function seedGifts() {
  const pipeline = redis.pipeline();
  for (const gift of DEFAULT_GIFTS) {
    if (!gift.id) continue;
    pipeline.hset(`gift:meta:${gift.id}`, {
      name: gift.name,
      url: gift.url || '',
      category: gift.category,
      icon: gift.icon,
      count: 0
    });
  }
  await pipeline.exec();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const rsvpId = searchParams.get('rsvpId') || undefined;

    // 1. Fetch RSVP doc once if not anonymous
    let rsvpDoc: any = null;
    if (rsvpId && !rsvpId.includes(':anon:') && !rsvpId.startsWith('anon:')) {
      rsvpDoc = await fetchRsvpDoc(rsvpId);
    }

    // 2. Discover all gifts via keys (safe at this scale)
    let keys = await redis.keys('gift:meta:*');
    
    if (keys.length === 0) {
      await seedGifts();
      keys = await redis.keys('gift:meta:*');
    }

    // 3. Fetch all metadata and reservation status
    // Using a pipeline to fetch all hgetall in one roundtrip
    const pipeline = redis.pipeline();
    keys.forEach(key => pipeline.hgetall(key));
    const results = await pipeline.exec();

    const gifts = keys.map((key, index) => {
      const id = key.replace('gift:meta:', '');
      const m = results[index] as any;
      
      let isReserved = false;
      if (rsvpDoc && rsvpDoc.reservedGifts) {
        isReserved = rsvpDoc.reservedGifts.includes(id);
      }

      return {
        id,
        name: m?.name || 'Unknown Gift',
        url: m?.url || '',
        category: m?.category || 'other',
        icon: m?.icon || 'wave',
        reserved: isReserved,
        reservedCount: Number(m?.count || 0),
      };
    });

    let filteredGifts = gifts;

    if (category) {
      const catLower = category.toLowerCase().trim();
      filteredGifts = gifts.filter((gift) => gift.category.toLowerCase() === catLower);
    }

    return NextResponse.json(filteredGifts, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching gifts:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch gifts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
