import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ServiceDealCard from '@/components/ServiceDealCard';
import { SERVICES } from '../../lib/data';
import {
  BROWSE_CATEGORIES,
  NAV_MENUS,
  getBrowseCategory,
  getNavMenuServices,
  getServicesForBrowseCategory,
} from '../../lib/navMenus';

export const metadata: Metadata = {
  title: 'Servisler — BlackNOOK',
  description: 'BlackNOOK üzerindeki tüm premium servis ve araçlar.',
};

type PageProps = {
  searchParams?: { type?: string; cat?: string; category?: string };
};

export default function ServicesPage({ searchParams }: PageProps) {
  const type = searchParams?.type;
  const cat = searchParams?.cat;
  const browseId = searchParams?.category;

  const menu = NAV_MENUS.find((m) => m.id === type);
  const browse = browseId ? getBrowseCategory(browseId) : undefined;

  let list = SERVICES;
  let title = 'Tüm servisler';

  if (browse) {
    list = getServicesForBrowseCategory(browse.id);
    title = browse.label;
  } else if (menu) {
    list = getNavMenuServices(menu, { cat });
    title = cat || (menu.id !== 'services' ? menu.label : 'Tüm servisler');
  }

  return (
    <main className="min-h-screen bg-transparent pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Ana sayfa
        </Link>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">{list.length} uygulama ve araç</p>
          </div>
          {(browse || (menu && menu.id !== 'services') || cat) && (
            <Link
              href="/services"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Tüm servisleri gör
            </Link>
          )}
        </div>

        {!browse && !type && (
          <div className="mb-10 flex flex-wrap gap-2">
            {BROWSE_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/services?category=${c.id}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, index) => (
            <ServiceDealCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
