import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import { buildPageMetadata } from '@/lib/seo';
import StatusView from '@/components/partners/StatusView';

export const metadata: Metadata = buildPageMetadata({
  title: 'Başvuru durumu | Blacknook Partners',
  description: 'Blacknook partner başvuru ve ürün durumunuzu görüntüleyin.',
  path: '/partners/status',
  noIndex: true,
});

export default function PartnersStatusPage() {
  return (
    <DemoGate>
      <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-28 sm:px-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Partners
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Başvuru durumu
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Akış: partner programı → ürün oluştur → inceleme. Onay sonrası paneline erişirsiniz.
        </p>
        <div className="mt-10">
          <StatusView />
        </div>
      </main>
    </DemoGate>
  );
}
