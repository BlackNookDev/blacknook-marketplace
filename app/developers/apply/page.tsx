import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import DeveloperApplyForm from '@/components/developers/DeveloperApplyForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Başvuru | Blacknook',
  description: 'Yazılımcı veya girişimci başvurusu.',
  path: '/developers/apply',
});

export default function DevelopersApplyPage() {
  return (
    <AuthGate fallbackHref="/login" loadingLabel="Yükleniyor…">
      <main className="min-h-screen bg-transparent px-4 pb-24 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Geliştirici
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Başvuru
          </h1>
          <div className="mt-10">
            <DeveloperApplyForm />
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
