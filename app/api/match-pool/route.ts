import { NextResponse } from 'next/server';
import { countMatchPool, listMatchPool, toPublicPerson } from '@/lib/matchAssign';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCriticalSchema();
    const [count, people] = await Promise.all([countMatchPool(), listMatchPool(8)]);
    return NextResponse.json({
      count,
      people: people.map(toPublicPerson),
    });
  } catch (error) {
    await logServerError({ source: 'match-pool.GET', error });
    return NextResponse.json({ count: 0, people: [] });
  }
}
