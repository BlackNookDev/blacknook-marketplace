import { NextResponse } from 'next/server';
import { countMatchPool, listMatchPool, toPublicPerson } from '@/lib/matchAssign';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [count, people] = await Promise.all([countMatchPool(), listMatchPool(8)]);
    return NextResponse.json({
      count,
      people: people.map(toPublicPerson),
    });
  } catch (error) {
    console.error('[match-pool] Hata:', error);
    return NextResponse.json({ count: 0, people: [] });
  }
}
