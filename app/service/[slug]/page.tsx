import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { getAllServiceSlugs, getServiceBySlug } from '../../../lib/data';
import ServiceDetailActions from './ServiceDetailActions';

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: 'Servis bulunamadı' };
  return {
    title: `${service.name} — BlackNOOK`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <main className="min-h-screen bg-transparent pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-12 text-sm text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="transition-colors duration-premium ease-premium hover:text-zinc-300"
              >
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden className="text-zinc-700">
              /
            </li>
            <li>
              <Link
                href="/#service-grid"
                className="transition-colors duration-premium ease-premium hover:text-zinc-300"
              >
                Servisler
              </Link>
            </li>
            <li aria-hidden className="text-zinc-700">
              /
            </li>
            <li className="text-zinc-300">{service.name}</li>
          </ol>
        </nav>

        <header className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
            <ServiceCatalogLogo
              icon={service.icon}
              brandColor={service.brandColor}
              name={service.name}
              size="lg"
            />
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              {service.category}
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-500 md:text-xl">
              {service.description}
            </p>
          </div>
        </header>

        <div className="mt-14 flex flex-col gap-14 lg:flex-row lg:gap-16">
          <div className="w-full space-y-12 lg:w-[62%]">
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold text-white">Genel bakış</h2>
              <p className="leading-relaxed text-zinc-400">{service.about}</p>
            </section>

            <section>
              <h2 className="mb-6 font-display text-2xl font-semibold text-white">
                Öne çıkan özellikler
              </h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 py-1">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-6 font-display text-2xl font-semibold text-white">
                Kullanım senaryoları
              </h2>
              <ul className="space-y-4">
                {service.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="border-l border-white/15 pl-5 leading-relaxed text-zinc-400"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="w-full lg:w-[38%]">
            <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
              <h3 className="mb-3 font-display text-lg font-semibold text-white">
                Projeye entegre et
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                {service.name} servisini BlackNOOK üzerinden projenize ekleyin.
              </p>
              <ServiceDetailActions serviceName={service.name} serviceSlug={service.slug} />

              <dl className="mt-8 space-y-4 border-t border-white/[0.08] pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Kategori</dt>
                  <dd className="text-right font-medium text-zinc-200">{service.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500">Sağlayıcı</dt>
                  <dd className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <Check className="h-4 w-4" aria-hidden />
                    Doğrulanmış
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
