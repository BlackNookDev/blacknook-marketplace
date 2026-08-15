/**
 * Next.js instrumentation Edge runtime’da da derlenir.
 * pg / fs buradan import edilmemeli — Docker build `Can't resolve 'fs'` ile düşer.
 * Şema tamamlama: docker/entrypoint migrate + API içindeki ensureCriticalSchema().
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;
}
