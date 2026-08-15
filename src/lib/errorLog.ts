import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export type ErrorFields = {
  name?: string;
  message: string;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
  schema?: string;
  table?: string;
  column?: string;
  constraint?: string;
  stack?: string;
};

export function serializeError(error: unknown): ErrorFields {
  if (error instanceof Error) {
    const e = error as Error & Record<string, unknown>;
    return {
      name: e.name,
      message: e.message,
      code: typeof e.code === 'string' ? e.code : undefined,
      detail: typeof e.detail === 'string' ? e.detail : undefined,
      hint: typeof e.hint === 'string' ? e.hint : undefined,
      position: e.position != null ? String(e.position) : undefined,
      schema: typeof e.schema === 'string' ? e.schema : undefined,
      table: typeof e.table === 'string' ? e.table : undefined,
      column: typeof e.column === 'string' ? e.column : undefined,
      constraint: typeof e.constraint === 'string' ? e.constraint : undefined,
      stack: e.stack,
    };
  }
  return { message: String(error) };
}

function logToConsole(source: string, fields: ErrorFields, extra?: Record<string, unknown>) {
  console.error(`[${source}]`, fields.message, {
    code: fields.code,
    detail: fields.detail,
    hint: fields.hint,
    table: fields.table,
    column: fields.column,
    constraint: fields.constraint,
    ...extra,
  });
  if (fields.stack) console.error(fields.stack);
}

export async function logServerError(params: {
  source: string;
  error: unknown;
  req?: NextRequest;
  userId?: number;
  extra?: Record<string, unknown>;
}): Promise<number | null> {
  const fields = serializeError(params.error);
  const method = params.req?.method || null;
  const path = params.req ? `${params.req.nextUrl.pathname}${params.req.nextUrl.search}` : null;

  logToConsole(params.source, fields, {
    method,
    path,
    userId: params.userId,
    ...params.extra,
  });

  try {
    const [result]: any = await pool.query(
      `INSERT INTO error_logs (source, message, stack, detail, method, path, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        params.source.slice(0, 120),
        fields.message.slice(0, 8000),
        fields.stack ? fields.stack.slice(0, 16000) : null,
        JSON.stringify({ ...fields, extra: params.extra || undefined }),
        method,
        path ? path.slice(0, 500) : null,
        params.userId ?? null,
      ]
    );
    return result.insertId != null ? Number(result.insertId) : null;
  } catch (writeError) {
    console.error('[errorLog] DB yazılamadı:', serializeError(writeError).message);
    return null;
  }
}

export function failResponse(
  userMessage: string,
  logId: number | null,
  status = 500
) {
  return NextResponse.json(
    {
      error: userMessage,
      logId,
    },
    { status }
  );
}
