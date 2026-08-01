import { Plus, Trash2 } from 'lucide-react';
import type { FeatureMatrixRow, ListingDraft, ListingTier } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepPricing({ draft, update }: Props) {
  const setTiers = (tiers: ListingTier[]) => {
    const matrix = draft.matrix.map((row) => ({
      ...row,
      values: tiers.map((_, i) => row.values[i] ?? ''),
    }));
    update({ tiers, matrix });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Fiyatlandırma</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Önce model seçin, sonra katmanlar ve karşılaştırma satırları. Giriş katmanı $49 veya altı
          önerilir.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              id: 'licensing' as const,
              title: 'Licensing',
              body: 'İsimli katmanlar (Solo, Pro). Yetenekler katmana göre değişir.',
            },
            {
              id: 'codes' as const,
              title: 'Codes',
              body: 'Kod yığarak limit artırılır (koltuk, proje, site).',
            },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => update({ pricingModel: m.id })}
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              draft.pricingModel === m.id
                ? 'border-white/30 bg-white/[0.06]'
                : 'border-white/[0.08] bg-transparent hover:bg-white/[0.03]'
            }`}
          >
            <p className="text-sm font-semibold text-white">{m.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{m.body}</p>
          </button>
        ))}
      </div>

      {draft.pricingModel === 'codes' ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Maks. kod sayısı</label>
          <input
            type="number"
            min={1}
            max={20}
            value={draft.maxCodes}
            onChange={(e) => update({ maxCodes: Number(e.target.value) })}
            className={`${field} max-w-[8rem]`}
          />
        </div>
      ) : null}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-200">Katmanlar (1–3)</p>
          {draft.tiers.length < 3 ? (
            <button
              type="button"
              onClick={() =>
                setTiers([
                  ...draft.tiers,
                  {
                    id: `tier_${Date.now()}`,
                    name: `Plan ${draft.tiers.length + 1}`,
                    price: 149,
                    recommended: false,
                  },
                ])
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Katman
            </button>
          ) : null}
        </div>
        <div className="space-y-4">
          {draft.tiers.map((tier, ti) => (
            <div
              key={tier.id}
              className="grid gap-3 rounded-xl border border-white/[0.08] p-4 sm:grid-cols-[1fr_7rem_auto_auto]"
            >
              <input
                value={tier.name}
                onChange={(e) => {
                  const tiers = draft.tiers.map((t, i) =>
                    i === ti ? { ...t, name: e.target.value } : t
                  );
                  setTiers(tiers);
                }}
                className={field}
                placeholder="Katman adı"
              />
              <input
                type="number"
                min={1}
                max={9999}
                value={tier.price}
                onChange={(e) => {
                  const tiers = draft.tiers.map((t, i) =>
                    i === ti ? { ...t, price: Number(e.target.value) } : t
                  );
                  setTiers(tiers);
                }}
                className={field}
              />
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={tier.recommended}
                  onChange={(e) => {
                    const tiers = draft.tiers.map((t, i) => ({
                      ...t,
                      recommended: i === ti ? e.target.checked : false,
                    }));
                    setTiers(tiers);
                  }}
                />
                Önerilen
              </label>
              {draft.tiers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setTiers(draft.tiers.filter((_, i) => i !== ti))}
                  className="text-rose-300"
                  aria-label="Katmanı kaldır"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <span />
              )}
              {tier.price > 49 && ti === 0 ? (
                <p className="sm:col-span-4 text-xs text-amber-300/90">
                  Giriş katmanı $49 üzeri: kabul ve dönüşüm şansı düşebilir. Hacim limiti ile
                  kapsamayı düşünün.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-200">Özellik matrisi</p>
          <button
            type="button"
            onClick={() => {
              const row: FeatureMatrixRow = {
                id: `row_${Date.now()}`,
                label: '',
                values: draft.tiers.map(() => ''),
                inAllPlans: false,
              };
              update({ matrix: [...draft.matrix, row] });
            }}
            className="text-xs font-medium text-sky-400"
          >
            + Satır
          </button>
        </div>
        <p className="mb-4 text-xs text-zinc-600">
          Somut değerler yazın (5 / 25 / Sınırsız). Aynı olanları “tüm planlarda” işaretleyin.
        </p>
        <div className="space-y-3 overflow-x-auto">
          {draft.matrix.map((row, ri) => (
            <div key={row.id} className="min-w-[28rem] space-y-2 rounded-xl border border-white/[0.08] p-3">
              <div className="flex gap-2">
                <input
                  value={row.label}
                  onChange={(e) => {
                    const matrix = draft.matrix.map((r, i) =>
                      i === ri ? { ...r, label: e.target.value } : r
                    );
                    update({ matrix });
                  }}
                  className={field}
                  placeholder="Özellik etiketi"
                />
                <button
                  type="button"
                  onClick={() => update({ matrix: draft.matrix.filter((_, i) => i !== ri) })}
                  className="shrink-0 text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {!row.inAllPlans ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${draft.tiers.length}, 1fr)` }}>
                  {draft.tiers.map((t, ti) => (
                    <input
                      key={t.id}
                      value={row.values[ti] ?? ''}
                      onChange={(e) => {
                        const matrix = draft.matrix.map((r, i) => {
                          if (i !== ri) return r;
                          const values = [...r.values];
                          values[ti] = e.target.value;
                          return { ...r, values };
                        });
                        update({ matrix });
                      }}
                      className={field}
                      placeholder={t.name}
                    />
                  ))}
                </div>
              ) : null}
              <label className="flex items-center gap-2 text-xs text-zinc-500">
                <input
                  type="checkbox"
                  checked={row.inAllPlans}
                  onChange={(e) => {
                    const matrix = draft.matrix.map((r, i) =>
                      i === ri ? { ...r, inAllPlans: e.target.checked } : r
                    );
                    update({ matrix });
                  }}
                />
                Tüm planlarda aynı
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
