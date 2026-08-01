import Link from 'next/link';
import { Download } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';

export default function AccountProductsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ürünler
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <button
            type="button"
            className="font-medium text-sky-400 transition-colors hover:text-sky-300"
          >
            Satın alma geçmişini görüntüle
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium text-sky-400 transition-colors hover:text-sky-300"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            CSV indir
          </button>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
          İlk adımı atmak zor gelebilir. Birlikte başlayalım:{' '}
          <Link
            href="/services"
            className="font-medium text-sky-400 transition-colors hover:text-sky-300"
          >
            şimdi keşfet
          </Link>
        </p>
      </div>

      <div className="mt-4">
        <AccountSection
          title="Kurulum talepleri"
          description="Servis detayından gönderdiğiniz kurulum talepleri burada listelenir."
        />
      </div>
    </div>
  );
}
