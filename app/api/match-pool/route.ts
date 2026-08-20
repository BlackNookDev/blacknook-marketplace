import { NextResponse } from 'next/server';
import { buildPublicMatchPool, listMatchPool } from '@/lib/matchAssign';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCriticalSchema();
    const real = await listMatchPool(8);
    const { count, people } = buildPublicMatchPool(real);
    return NextResponse.json({ count, people });
  } catch (error) {
    await logServerError({ source: 'match-pool.GET', error });
    return NextResponse.json({ count: 0, people: [] });
  }
}
