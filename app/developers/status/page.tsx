import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import DeveloperStatusView from '@/components/developers/DeveloperStatusView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Geliştirici başvuru durumu | Blacknook',
  description: 'Geliştirici başvurunuzun durumunu görüntüleyin.',
  path: '/developers/status',
  noIndex: true,
});

export default function DevelopersStatusPage() {
  return (
    <AuthGate fallbackHref="/login" loadingLabel="Durum yükleniyor…">
      <main className="min-h-screen bg-transparent px-4 pb-24 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Geliştirici
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Başvuru durumu
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Onay sonrası portal açılır.</p>
          <div className="mt-10">
            <DeveloperStatusView />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
