import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { charHint, LISTING_CATEGORIES, type ListingDraft } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepBasic({ draft, update }: Props) {
  const highlights = draft.tldr.length ? draft.tldr : [''];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Temel bilgiler</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Alıcının ilk gördüğü satırlar. Ne işe yaradığını net ve somut yazın.
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
          placeholder="Örn. Görev paneli"
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
        label="Kısa açıklama"
        hint={charHint(draft.tagline.length, 100)}
        htmlFor="tagline"
        help="Tek cümle: ürün kimin için, hangi sorunu çözer."
      >
        <input
          id="tagline"
          maxLength={100}
          value={draft.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          className={field}
          placeholder="Örn. Ajanslar için görev ve fatura takibi"
        />
      </Field>

      <Field
        label="Alt başlık"
        hint={charHint(draft.secondaryTagline.length, 140)}
        htmlFor="secondary"
        help="İsteğe bağlı ikinci cümle veya kısa çağrı."
      >
        <input
          id="secondary"
          maxLength={140}
          value={draft.secondaryTagline}
          onChange={(e) => update({ secondaryTagline: e.target.value })}
          className={field}
          placeholder="Örn. Tüm işleri tek ekrandan yönetin"
        />
      </Field>

      <Field
        label="Neden sizi tercih etmeliler?"
        hint={charHint(draft.usp.length, 255)}
        htmlFor="usp"
        help="Rakiplerden farkınızı 2–3 cümlede anlatın."
      >
        <textarea
          id="usp"
          maxLength={255}
          rows={3}
          value={draft.usp}
          onChange={(e) => update({ usp: e.target.value })}
          className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
          placeholder="Örn. Self-host kurulum, tek tık yedekleme ve Türkçe destek."
        />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-zinc-300">Öne çıkan faydalar</p>
          {highlights.length < 4 ? (
            <button
              type="button"
              onClick={() => update({ tldr: [...highlights, ''] })}
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Madde ekle
            </button>
          ) : null}
        </div>
        <p className="mb-3 text-xs text-zinc-600">1–4 kısa madde. Alıcının hemen görmesini istediğiniz sonuçlar.</p>
        <div className="space-y-2">
          {highlights.map((item, i) => (
            <div key={`tldr-${i}`} className="flex gap-2">
              <input
                maxLength={128}
                value={item}
                onChange={(e) => {
                  const next = [...highlights];
                  next[i] = e.target.value;
                  update({ tldr: next });
                }}
                className={field}
                placeholder={i === 0 ? 'Örn. Dakikalar içinde kendi sunucunuza kurun' : 'Somut bir fayda yazın'}
              />
              {highlights.length > 1 ? (
                <button
                  type="button"
                  onClick={() => update({ tldr: highlights.filter((_, idx) => idx !== i) })}
                  className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                  aria-label={`Fayda ${i + 1} maddesini kaldır`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Sil
                </button>
              ) : null}
            </div>
          ))}
        </div>
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
        <Field label="Entegrasyonlar" htmlFor="int" help="En fazla 4, virgülle.">
          <input
            id="int"
            value={draft.integrations}
            onChange={(e) => update({ integrations: e.target.value })}
            className={field}
            placeholder="Slack, Stripe"
          />
        </Field>
        <Field label="Kimler için" htmlFor="best" help="En fazla 3, virgülle.">
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
