/**
 * Next.js instrumentation — edge bundle’a Node-only (pg) çekilmesin.
 * Migrate + admin seed Docker entrypoint / `npm run migrate` ile çalışır.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
}
