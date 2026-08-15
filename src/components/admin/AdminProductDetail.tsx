'use client';

import { useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/demo/StatusBadge';
import VerifiedBadge from '@/components/VerifiedBadge';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { deliveryLabel } from '@/lib/listingValidate';
import { listingTypeLabel, type ListingDraft } from '@/lib/listingDraft';

export type AdminProductRow = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription?: string;
  coverImage?: string;
  iconImage?: string;
  brandColor?: string;
  gallery?: string[];
  features?: string[];
  listing?: Partial<ListingDraft> | null;
  status: 'pending' | 'approved' | 'rejected' | 'unpublished';
  verified?: boolean;
  rejectReason?: string;
  vendorName: string;
  vendorEmail?: string;
  createdAt?: string;
  tiers: { id: number | string; name?: string; price?: number }[];
};

type Props = {
  product: AdminProductRow;
  defaultOpen?: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onUnpublish: (id: number, reason: string) => void;
};

function formatDate(value?: string) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value)
    );
  } catch {
    return value;
  }
}

function isImageSrc(value?: string) {
  if (!value) return false;
  return (
    value.startsWith('/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:')
  );
}

export default function AdminProductDetail({
  product: p,
  defaultOpen = false,
  onApprove,
  onReject,
  onUnpublish,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [rejecting, setRejecting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [reason, setReason] = useState('');
  const listing = p.listing || {};
  const icon = listing.catalogIcon || p.iconImage || '';
  const cover = isImageSrc(p.coverImage) ? p.coverImage : '';
  const gallery = (p.gallery || []).filter((src) => isImageSrc(src));
  const stories = (listing.stories || []).filter(
    (s) => s.title?.trim() || s.bullets?.some((b) => b.trim())
  );
  const faqs = (listing.faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
  const delivery = deliveryLabel(listing.delivery);

  return (
    <li className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <ServiceCatalogLogo
              icon={icon || p.title}
              brandColor={p.brandColor || '#6366F1'}
              name={p.title}
              size="md"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-zinc-100">{p.title}</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <span>
                {p.vendorName}
                {p.vendorEmail ? ` · ${p.vendorEmail}` : ''}
              </span>
              {p.verified ? <VerifiedBadge compact /> : null}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {p.category}
              {p.shortDescription ? ` · ${p.shortDescription}` : ''}
            </p>
            {p.createdAt ? (
              <p className="mt-1 text-xs text-zinc-600">{formatDate(p.createdAt)}</p>
            ) : null}
          </div>
        </div>
        <StatusBadge status={p.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
        >
          {open ? 'Detayı kapat' : 'Tüm detay'}
        </button>
        {p.status === 'pending' ? (
          <>
            <button
              type="button"
              onClick={() => onApprove(p.id)}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Onayla / yayınla
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting((v) => !v);
                setUnpublishing(false);
              }}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Reddet
            </button>
          </>
        ) : p.status === 'approved' ? (
          <>
            <Link
              href={`/service/${p.slug}`}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-sky-400 hover:text-sky-300"
            >
              Vitrinde gör
            </Link>
            <button
              type="button"
              onClick={() => {
                setUnpublishing((v) => !v);
                setRejecting(false);
              }}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Yayından kaldır
            </button>
          </>
        ) : p.status === 'unpublished' ? (
          <button
            type="button"
            onClick={() => onApprove(p.id)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Yeniden yayınla
          </button>
        ) : null}
      </div>

      {rejecting && p.status === 'pending' ? (
        <div className="mt-4 space-y-2">
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30"
            placeholder="Red nedeni (partnere gider)"
          />
          <button
            type="button"
            onClick={() => {
              onReject(p.id, reason.trim() || 'Eksik bilgi veya politika uyumsuzluğu.');
              setRejecting(false);
              setReason('');
            }}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Reddi gönder
          </button>
        </div>
      ) : null}

      {unpublishing && p.status === 'approved' ? (
        <div className="mt-4 space-y-2">
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30"
            placeholder="Katalogdan alma notu (partnere gider, isteğe bağlı)"
          />
          <button
            type="button"
            onClick={() => {
              onUnpublish(p.id, reason.trim() || 'Yayından kaldırıldı.');
              setUnpublishing(false);
              setReason('');
            }}
            className="rounded-xl bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:opacity-90"
          >
            Katalogdan kaldır
          </button>
        </div>
      ) : null}

      {p.status === 'rejected' && p.rejectReason ? (
        <p className="mt-3 text-xs text-rose-300">{p.rejectReason}</p>
      ) : null}

      {p.status === 'unpublished' && p.rejectReason ? (
        <p className="mt-3 text-xs text-zinc-400">{p.rejectReason}</p>
      ) : null}

      {open ? (
        <div className="mt-6 space-y-8 border-t border-white/[0.08] pt-6">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="max-h-72 w-full rounded-xl border border-white/10 object-cover"
            />
          ) : null}

          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Row k="Site" v={listing.websiteUrl} href={listing.websiteUrl} />
            <Row k="Tür" v={listingTypeLabel(listing.listingType)} />
            <Row k="Dokümantasyon" v={listing.docsUrl} href={listing.docsUrl} />
            <Row k="Destek" v={listing.supportEmail} href={listing.supportEmail ? `mailto:${listing.supportEmail}` : undefined} />
            <Row k="Nerede çalışır" v={delivery} />
          </dl>

          {p.longDescription ? (
            <Block title="Açıklama">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {p.longDescription}
              </p>
            </Block>
          ) : null}

          {p.tiers.length ? (
            <Block title="Planlar">
              <ul className="flex flex-wrap gap-2">
                {p.tiers.map((t) => (
                  <li
                    key={String(t.id)}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-200"
                  >
                    {t.name}: ${t.price}
                    {listing.tiers?.find((x) => String(x.id) === String(t.id))?.recommended
                      ? ' · öne çıkan'
                      : ''}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {stories.length ? (
            <Block title="Özellikler">
              <ul className="space-y-4">
                {stories.map((s) => (
                  <li key={s.id}>
                    <p className="text-sm font-medium text-zinc-100">{s.title}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                      {(s.bullets || []).filter(Boolean).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Block>
          ) : p.features?.length ? (
            <Block title="Özellikler">
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Block>
          ) : null}

          {gallery.length ? (
            <Block title="Ekran görüntüleri">
              <div className="grid gap-3 sm:grid-cols-2">
                {gallery.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="w-full rounded-xl border border-white/10 object-cover"
                  />
                ))}
              </div>
            </Block>
          ) : null}

          {listing.founderNarrative ? (
            <Block title="Hikâye">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {listing.founderNarrative}
              </p>
              {listing.founderName ? (
                <p className="mt-2 text-sm text-zinc-500">
                  {listing.founderName}
                  {listing.founderRole ? ` · ${listing.founderRole}` : ''}
                </p>
              ) : null}
            </Block>
          ) : null}

          {faqs.length ? (
            <Block title="SSS">
              <dl className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.id}>
                    <dt className="text-sm font-medium text-zinc-100">{f.question}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-zinc-400">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({ k, v, href }: { k: string; v?: string; href?: string }) {
  if (!v) return null;
  return (
    <div>
      <dt className="text-xs text-zinc-500">{k}</dt>
      <dd className="mt-1 break-all text-sm text-zinc-200">
        {href ? (
          <a href={href} className="text-sky-400 hover:text-sky-300" target="_blank" rel="noreferrer">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}
