/**
 * Next.js instrumentation — edge bundle’a Node-only (pg) çekilmesin.
 * Docker entrypoint migrate çalıştırır; burada eksik kolon/tablo yine tamamlanır
 * (production’da schema.sql indeksi migrate’i kırarsa API 500 vermesin).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
  try {
    const { ensureCriticalSchema } = await import('@/lib/ensureSchema');
    await ensureCriticalSchema();
  } catch (error) {
    console.error('[instrumentation] ensureSchema:', error);
  }
}
