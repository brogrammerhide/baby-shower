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

    // 1. Discover all gifts via keys (safe at this scale)
    let keys = await redis.keys('gift:meta:*');
    
    if (keys.length === 0) {
      await seedGifts();
      keys = await redis.keys('gift:meta:*');
    }

    // 2. Fetch all metadata and reservation status
    const gifts = await Promise.all(
      keys.map(async (key) => {
        const id = key.replace('gift:meta:', '');
        const meta = await redis.hgetall(key);
        const m = meta as any;
        
        let isReserved = false;
        if (rsvpId && !rsvpId.startsWith('rsvp:anon:')) {
          const rsvp = await fetchRsvpDoc(rsvpId);
          if (rsvp && rsvp.reservedGifts) {
            isReserved = rsvp.reservedGifts.includes(id);
          }
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
      })
    );

    let filteredGifts = gifts;

    if (category) {
      const catLower = category.toLowerCase().trim();
      filteredGifts = gifts.filter((gift) => gift.category.toLowerCase() === catLower);
    }

    return NextResponse.json(filteredGifts, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gifts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
