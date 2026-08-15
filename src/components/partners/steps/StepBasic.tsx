import type { ListingDraft } from '@/lib/listingDraft';
import { charHint, LISTING_CATEGORIES, LISTING_TYPES } from '@/lib/listingDraft';
import { FieldLabel } from '@/components/partners/FieldHint';
import { DELIVERY_OPTIONS } from '@/lib/listingValidate';

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
        <h2 className="font-display text-xl font-semibold text-white">Ürün</h2>
      </div>

      <div>
        <FieldLabel htmlFor="product-name" required hint="Müşterinin listede göreceği ad.">
          Ürün adı
        </FieldLabel>
        <input
          id="product-name"
          maxLength={75}
          value={draft.productName}
          onChange={(e) => update({ productName: e.target.value })}
          className={field}
          placeholder="Ghost"
        />
        <p className="mt-1.5 text-right text-[11px] tabular-nums text-zinc-600">
          {charHint(draft.productName.length, 75)}
        </p>
      </div>

      <div>
        <FieldLabel required hint="Ana sayfada ve katalogda hangi başlık altında duracağını belirler.">
          Tür
        </FieldLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          {LISTING_TYPES.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => update({ listingType: opt.id })}
              className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                draft.listingType === opt.id
                  ? 'border-white/30 bg-white/[0.06] text-white'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="category" required hint="Yanlış kategorideki ürün bulunmaz.">
          Kategori
        </FieldLabel>
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
      </div>

      <div>
        <FieldLabel htmlFor="tagline" required hint="Kartın altında duran tek cümle.">
          Kısa açıklama
        </FieldLabel>
        <input
          id="tagline"
          maxLength={100}
          value={draft.tagline}
          onChange={(e) => update({ tagline: e.target.value })}
          className={field}
          placeholder="Yayıncılar için açık kaynak CMS"
        />
      </div>

      <div>
        <FieldLabel htmlFor="usp" required hint="Detay sayfasındaki genel bakış metni.">
          Açıklama
        </FieldLabel>
        <textarea
          id="usp"
          maxLength={800}
          rows={4}
          value={draft.usp}
          onChange={(e) => update({ usp: e.target.value })}
          className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
          placeholder="Ne işe yarıyor, kim kuruyor, kurulum kabaca nasıl."
        />
      </div>

      <div>
        <FieldLabel htmlFor="website" required hint="Demo, ürün sitesi veya canlı örnek.">
          Site
        </FieldLabel>
        <input
          id="website"
          type="url"
          value={draft.websiteUrl}
          onChange={(e) => update({ websiteUrl: e.target.value })}
          className={field}
          placeholder="https://"
        />
      </div>

      <div>
        <FieldLabel required hint="Kurulum talebinde ekibe yol gösterir.">
          Nerede çalışır
        </FieldLabel>
        <div className="grid gap-2 sm:grid-cols-3">
          {DELIVERY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => update({ delivery: opt.id })}
              className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                draft.delivery === opt.id
                  ? 'border-white/30 bg-white/[0.06] text-white'
                  : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="support" required hint="Kurulum ve ürün soruları buraya gider.">
          Destek e-postası
        </FieldLabel>
        <input
          id="support"
          type="email"
          value={draft.supportEmail}
          onChange={(e) => update({ supportEmail: e.target.value })}
          className={field}
          placeholder="destek@firma.com"
        />
      </div>

      <div>
        <FieldLabel htmlFor="docs" hint="Kurulum veya API sayfası. Yoksa boş bırakın.">
          Dokümantasyon
        </FieldLabel>
        <input
          id="docs"
          type="url"
          value={draft.docsUrl}
          onChange={(e) => update({ docsUrl: e.target.value })}
          className={field}
          placeholder="https://"
        />
      </div>
    </div>
  );
}
