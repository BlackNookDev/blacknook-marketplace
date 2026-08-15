export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;

  try {
    const { seedAdmin } = await import('./scripts/seed-admin.js');
    await seedAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[seed-admin] Atlandı:', message);
  }
}
