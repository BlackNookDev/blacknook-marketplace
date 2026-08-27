/**
 * Coder stüdyosu (Kendi uygulamanı yap) — varsayılan kapalı.
 * Açmak için: NEXT_PUBLIC_CODER_FEATURE_ENABLED=true
 */
export function isCoderFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CODER_FEATURE_ENABLED === 'true';
}
