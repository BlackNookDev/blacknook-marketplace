import { Plus, Trash2 } from 'lucide-react';
import { listingUid, type ListingDraft, type ListingTier } from '@/lib/listingDraft';
import { FieldLabel } from '@/components/partners/FieldHint';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepPricing({ draft, update }: Props) {
  const setTiers = (tiers: ListingTier[]) => update({ tiers });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Fiyat</h2>
        <p className="mt-1 text-sm text-zinc-500">Satış dolar cinsinden. Ödeme henüz açık değil; plan yine de listelenir.</p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <FieldLabel required hint="Liste fiyatı ABD doları. En az bir plan gerekir.">
            Planlar
          </FieldLabel>
          {draft.tiers.length < 3 ? (
            <button
              type="button"
              onClick={() =>
                setTiers([
                  ...draft.tiers,
                  { id: listingUid('tier'), name: '', price: 0, recommended: false },
                ])
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Plan
            </button>
          ) : null}
        </div>

        <div className="space-y-3">
          {draft.tiers.map((tier) => (
            <div
              key={tier.id}
              className="grid gap-3 rounded-xl border border-white/[0.08] p-4 sm:grid-cols-[1fr_8rem_auto_auto]"
            >
              <input
                value={tier.name}
                onChange={(e) => {
                  setTiers(
                    draft.tiers.map((t) => (t.id === tier.id ? { ...t, name: e.target.value } : t))
                  );
                }}
                className={field}
                placeholder="Plan adı"
              />
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  max={99999}
                  value={tier.price || ''}
                  onChange={(e) => {
                    setTiers(
                      draft.tiers.map((t) =>
                        t.id === tier.id ? { ...t, price: Number(e.target.value) || 0 } : t
                      )
                    );
                  }}
                  className={`${field} pl-7`}
                  placeholder="99"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={tier.recommended}
                  onChange={(e) => {
                    setTiers(
                      draft.tiers.map((t) => ({
                        ...t,
                        recommended: t.id === tier.id ? e.target.checked : false,
                      }))
                    );
                  }}
                />
                Öne çıkan
              </label>
              {draft.tiers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setTiers(draft.tiers.filter((t) => t.id !== tier.id))}
                  className="inline-flex items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                  aria-label="Planı sil"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
