import type { Metadata } from 'next';
import Link from 'next/link';
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

  if (browse) {
    list = getServicesForBrowseCategory(browse.id);
  } else if (menu) {
    list = getNavMenuServices(menu, { cat });
  }

  return (
    <main className="min-h-screen bg-transparent pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-6">
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

        {(browse || type) && (
          <div className="mb-8 flex justify-end">
            <Link
              href="/services"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Tüm servisleri gör
            </Link>
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
