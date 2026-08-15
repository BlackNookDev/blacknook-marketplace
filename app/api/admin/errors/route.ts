import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { checkRequiredSchema, ensureCriticalSchema } from '@/lib/ensureSchema';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
    }

    const schema = await checkRequiredSchema();
    const [rows]: any = await pool.query(
      `SELECT id, source, message, stack, detail, method, path, user_id, created_at
       FROM error_logs
       ORDER BY created_at DESC, id DESC
       LIMIT 100`
    );

    return NextResponse.json({
      schema,
      errors: (rows || []).map((row: any) => {
        let detail: unknown = row.detail;
        if (typeof detail === 'string') {
          try {
            detail = JSON.parse(detail);
          } catch {
            /* keep string */
          }
        }
        return {
          id: Number(row.id),
          source: row.source,
          message: row.message,
          stack: row.stack,
          detail,
          method: row.method,
          path: row.path,
          userId: row.user_id ? Number(row.user_id) : null,
          createdAt: row.created_at,
        };
      }),
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'admin.errors.GET',
      error,
      req,
    });
    return failResponse('Hata kayıtları yüklenemedi.', logId);
  }
}
