import type { ReactNode } from 'react';
import { charHint, LISTING_CATEGORIES, type ListingDraft } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepBasic({ draft, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Temel bilgiler</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Alıcının ilk gördüğü satırlar. Sonuç odaklı yazın; slogan değil arama dili.
        </p>
      </div>

      <Field
        label="Ürün adı"
        hint={charHint(draft.productName.length, 75)}
        htmlFor="product-name"
      >
        <input
          id="product-name"
          maxLength={75}
          value={draft.productName}
          onChange={(e) => update({ productName: e.target.value })}
          className={field}
          placeholder="Laneflow"
        />
      </Field>

      <Field label="Kategori" htmlFor="category">
        <select
          id="category"
          value={draft.category}
          onChange={(e) => update({ category: e.target.value })}
          className={field}
        >
          {LISTING_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-zinc-900">
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Tagline"
        hint={charHint(draft.tagline.length, 100)}
        htmlFor="tagline"
        help="SEO satırı: alıcının arayacağı kelimelerle başlayın."
      >
        <input
          id="tagline"
          maxLength={100}
          value={draft.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          className={field}
          placeholder="Ajanslar için retainer takibi"
        />
      </Field>

      <Field
        label="İkincil tagline"
        hint={charHint(draft.secondaryTagline.length, 140)}
        htmlFor="secondary"
        help="Kısa CTA, yaklaşık 5–8 kelime."
      >
        <input
          id="secondary"
          maxLength={140}
          value={draft.secondaryTagline}
          onChange={(e) => update({ secondaryTagline: e.target.value })}
          className={field}
          placeholder="Her retainer’ı anlık görün"
        />
      </Field>

      <Field
        label="Benzersiz satış önerisi (USP)"
        hint={charHint(draft.usp.length, 255)}
        htmlFor="usp"
        help="Neden alternatiften daha iyi? 30–255 karakter."
      >
        <textarea
          id="usp"
          maxLength={255}
          rows={3}
          value={draft.usp}
          onChange={(e) => update({ usp: e.target.value })}
          className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-300">TL;DR (tam 2 madde)</p>
        {[0, 1].map((i) => (
          <input
            key={i}
            maxLength={128}
            value={draft.tldr[i]}
            onChange={(e) => {
              const next: [string, string] = [...draft.tldr];
              next[i] = e.target.value;
              update({ tldr: next });
            }}
            className={`${field} mb-2`}
            placeholder={i === 0 ? 'Fiille başlayan somut madde' : 'İkinci somut madde'}
          />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Alternatif olduğu araçlar" htmlFor="alt" help="En fazla 3, virgülle.">
          <input
            id="alt"
            value={draft.alternativeTo}
            onChange={(e) => update({ alternativeTo: e.target.value })}
            className={field}
            placeholder="Asana, Monday"
          />
        </Field>
        <Field label="Entegrasyonlar" htmlFor="int" help="En fazla 4.">
          <input
            id="int"
            value={draft.integrations}
            onChange={(e) => update({ integrations: e.target.value })}
            className={field}
            placeholder="Slack, Stripe"
          />
        </Field>
        <Field label="Kimler için" htmlFor="best" help="En fazla 3.">
          <input
            id="best"
            value={draft.bestFor}
            onChange={(e) => update({ bestFor: e.target.value })}
            className={field}
            placeholder="Freelancer, ajans"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
        {hint ? <span className="text-[11px] tabular-nums text-zinc-600">{hint}</span> : null}
      </div>
      {children}
      {help ? <p className="mt-1.5 text-xs text-zinc-600">{help}</p> : null}
    </div>
  );
}
