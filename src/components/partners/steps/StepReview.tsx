import type { ListingDraft } from '@/lib/listingDraft';
import { deliveryLabel, firstIncompleteStep, getStepErrors } from '@/lib/listingValidate';
import { LISTING_STEPS } from '@/lib/listingDraft';

type Props = { draft: ListingDraft };

export default function StepReview({ draft }: Props) {
  const blocked = firstIncompleteStep(draft);
  const blockedLabel = blocked
    ? LISTING_STEPS.find((s) => s.id === blocked)?.label
    : null;
  const blockedErrors = blocked ? getStepErrors(blocked, draft) : [];
  const faqs = draft.faqs.filter((f) => f.question.trim() && f.answer.trim());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Gönder</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Admin onayından sonra katalogda görünür. Taslak hesabınızda duruyor.
        </p>
      </div>

      {blocked ? (
        <p className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100">
          {blockedLabel}: {blockedErrors[0]}
        </p>
      ) : null}

      <Section title="Ürün">
        <Row k="Ad" v={draft.productName || '—'} />
        <Row k="Kategori" v={draft.category} />
        <Row k="Site" v={draft.websiteUrl || '—'} />
        <Row k="Çalışır" v={deliveryLabel(draft.delivery) || '—'} />
        <Row k="Destek" v={draft.supportEmail || '—'} />
      </Section>

      <Section title="Fiyat">
        {draft.tiers
          .filter((t) => t.name.trim())
          .map((t) => (
            <Row
              key={t.id}
              k={t.name}
              v={`$${t.price}${t.recommended ? ' · öne çıkan' : ''}`}
            />
          ))}
      </Section>

      <Section title="Hikâye">
        <Row k="Kim" v={draft.founderName || '—'} />
        <Row k="SSS" v={`${faqs.length} soru`} />
      </Section>
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
      <dd className="break-all text-sm text-zinc-200 sm:text-right">{v}</dd>
    </div>
  );
}
