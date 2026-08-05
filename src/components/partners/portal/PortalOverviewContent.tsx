'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Package,
  TrendingUp,
  ThumbsUp,
} from 'lucide-react';
import StatusBadge from '@/components/demo/StatusBadge';
import { usePartnerAccess } from '@/components/partners/portal/PartnerAccess';
import { getMyProducts, type DemoVendorProduct, VENDOR_EVENT } from '@/lib/demoVendor';
import { buildDemoSales, formatTry } from '@/lib/partnerPortal';

function EmptyWelcome() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
        <div
          className="relative mx-auto flex h-48 w-full max-w-sm items-center justify-center sm:h-56"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-500/5" />
          <svg viewBox="0 0 320 200" className="relative h-full w-full px-4">
            <path
              d="M40 150 C80 140, 100 80, 140 90 C180 100, 200 50, 250 40"
              fill="none"
              stroke="rgb(45 212 191)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="250" cy="40" r="6" fill="rgb(52 211 153)" />
            <rect
              x="48"
              y="100"
              width="40"
              height="52"
              rx="8"
              fill="rgb(24 24 27)"
              stroke="rgb(63 63 70)"
            />
            <path d="M58 118 h20 M58 128 h16 M58 138 h12" stroke="rgb(161 161 170)" strokeWidth="2" />
            <path d="M100 88 l10 -22 7 5 -10 22z" fill="rgb(52 211 153)" opacity="0.9" />
            <circle cx="210" cy="130" r="32" fill="rgb(24 24 27)" stroke="rgb(63 63 70)" />
            <path
              d="M198 128 h10 a6 6 0 0 1 6 6 v8 h-22 v-8 a6 6 0 0 1 6 -6z M203 118 a7 7 0 1 1 14 0"
              fill="none"
              stroke="rgb(94 234 212)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute right-6 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
            <ThumbsUp className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="absolute bottom-6 left-8 flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10 text-teal-300">
            <TrendingUp className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="absolute bottom-10 right-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Blacknook ile ortak olun
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Partner Portal’a giriş yaptınız. Satışa ve onay sonrası burada özet metrikler, siparişler
            ve liste durumunuz görünecek.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Hazır mısınız? İlk ürününüzü listelemek için{' '}
            <strong className="font-semibold text-zinc-200">Satmaya başlayın</strong>’a tıklayın.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Blacknook Select ile ilgileniyor musunuz?{' '}
            <Link href="/select" className="text-teal-300/90 underline underline-offset-2 hover:text-teal-200">
              Select programını inceleyin
            </Link>
            .
          </p>
          <Link
            href="/partners/self-submission"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Satmaya başlayın
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PendingWelcome({ submittedAt }: { submittedAt?: string }) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-6 sm:p-10">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="pending" />
        <p className="text-sm font-medium text-amber-100">Başvurunuz incelemede</p>
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-white">Portal hazır — içerik yakında</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
        Menüyü gezebilir, destek alabilir ve Select’i inceleyebilirsiniz. Listeler, satış analitiği
        ve faturalandırma partner onayından sonra açılır.
      </p>
      {submittedAt ? (
        <p className="mt-2 text-xs text-zinc-500">
          Gönderim: {new Date(submittedAt).toLocaleString('tr-TR')}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/partners/status"
          className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
        >
          Başvuru durumu
        </Link>
        <Link
          href="/partners/support"
          className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
        >
          Destek
        </Link>
      </div>
    </div>
  );
}

function RejectedWelcome({ reason }: { reason?: string }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-6 sm:p-10">
      <StatusBadge status="rejected" />
      <h2 className="mt-4 font-display text-2xl font-bold text-white">Başvuru güncellemesi gerekli</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
        {reason || 'Başvurunuz reddedildi. Ürün formunu güncelleyip yeniden gönderebilirsiniz.'}
      </p>
      <Link
        href="/partners/self-submission"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
      >
        Başvuruyu güncelle
      </Link>
    </div>
  );
}

export default function PortalOverviewContent() {
  const { ready, canManage, application, role } = usePartnerAccess();
  const [products, setProducts] = useState<DemoVendorProduct[]>([]);

  useEffect(() => {
    const tick = () => setProducts(getMyProducts());
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  if (!ready) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (!canManage) {
    if (application?.status === 'rejected') {
      return <RejectedWelcome reason={application.rejectReason} />;
    }
    if (role === 'pending' || application?.status === 'pending') {
      return <PendingWelcome submittedAt={application?.submittedAt} />;
    }
    return <EmptyWelcome />;
  }

  if (products.length === 0) {
    return <EmptyWelcome />;
  }

  const pending = products.filter((p) => p.status === 'pending').length;
  const approved = products.filter((p) => p.status === 'approved').length;
  const sales = buildDemoSales(products);
  const revenue = sales.filter((s) => s.status === 'completed').reduce((a, s) => a + s.amount, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Toplam ürün', value: String(products.length), icon: Package },
          { label: 'İncelemede', value: String(pending), icon: Clock },
          { label: 'Yayında', value: String(approved), icon: CheckCircle2 },
          { label: 'Gelir', value: formatTry(revenue), icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-zinc-500">{label}</p>
              <Icon className="h-4 w-4 text-zinc-600" aria-hidden />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/partners/self-submission"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
        >
          Yeni ürün ekle
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/partners/listings"
          className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
        >
          Tüm listeler
        </Link>
        <Link
          href="/partners/sales"
          className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
        >
          Satış ve analitik
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-white">Son ürünler</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-zinc-950/40 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">{p.title}</p>
                  <p className="text-xs text-zinc-500">
                    {p.category} · {p.tiers.length} plan
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-white">Son satışlar</h2>
          {sales.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              Satışlar oluşunca burada görünür.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sales.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-zinc-950/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{s.productTitle}</p>
                    <p className="text-xs text-zinc-500">
                      {s.plan} · {new Date(s.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-300">{formatTry(s.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
