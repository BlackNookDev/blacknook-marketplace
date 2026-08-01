import type { ListingDraft } from '@/lib/listingDraft';

type Props = { draft: ListingDraft };

export default function StepReview({ draft }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Gözden geçir</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Göndermeden önce özeti kontrol edin. Taslak localStorage’da kalır; moderasyon paneline
          ürün + başvuru düşer.
        </p>
      </div>

      <Section title="Temel">
        <Row k="Ürün" v={draft.productName || '—'} />
        <Row k="Kategori" v={draft.category} />
        <Row k="Tagline" v={draft.tagline || '—'} />
        <Row k="USP" v={draft.usp || '—'} />
      </Section>

      <Section title="Fiyat">
        <Row k="Model" v={draft.pricingModel === 'codes' ? 'Codes' : 'Licensing'} />
        {draft.tiers.map((t) => (
          <Row
            key={t.id}
            k={t.name}
            v={`$${t.price}${t.recommended ? ' · önerilen' : ''}`}
          />
        ))}
      </Section>

      <Section title="Hikaye">
        <Row k="Kurucu" v={draft.founderName || '—'} />
        <Row k="Ekip / aşama" v={`${draft.teamSize} · ${draft.stage}`} />
      </Section>

      <Section title="SSS">
        <Row
          k="Adet"
          v={`${draft.faqs.filter((f) => f.question.trim()).length} soru`}
        />
      </Section>

      {!draft.productName.trim() ? (
        <p className="text-sm text-amber-300">Göndermek için ürün adı zorunlu.</p>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </h3>
      <dl className="space-y-2">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/[0.05] py-2 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-zinc-500">{k}</dt>
      <dd className="text-sm text-zinc-200 sm:text-right">{v}</dd>
    </div>
  );
}
