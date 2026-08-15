import { Plus, Trash2 } from 'lucide-react';
import { listingUid, type FeatureMatrixRow, type ListingDraft, type ListingTier } from '@/lib/listingDraft';

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
          Önce modeli seçin, sonra planları ve karşılaştırma satırlarını ekleyin.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              id: 'licensing' as const,
              title: 'Lisans planları',
              body: 'İsimli katmanlar (Başlangıç, Profesyonel). Yetenekler plana göre değişir.',
            },
            {
              id: 'codes' as const,
              title: 'Kullanım kodları',
              body: 'Kod ekleyerek limit artar (kullanıcı, proje, site).',
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
          <label className="mb-2 block text-sm font-medium text-zinc-300">Maksimum kod sayısı</label>
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
          <p className="text-sm font-semibold text-zinc-200">Planlar (1–3)</p>
          {draft.tiers.length < 3 ? (
            <button
              type="button"
              onClick={() =>
                setTiers([
                  ...draft.tiers,
                  {
                    id: listingUid('tier'),
                    name: `Plan ${draft.tiers.length + 1}`,
                    price: 149,
                    recommended: false,
                  },
                ])
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Plan ekle
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
                  setTiers(
                    draft.tiers.map((t) => (t.id === tier.id ? { ...t, name: e.target.value } : t))
                  );
                }}
                className={field}
                placeholder="Plan adı"
              />
              <input
                type="number"
                min={1}
                max={9999}
                value={tier.price}
                onChange={(e) => {
                  setTiers(
                    draft.tiers.map((t) =>
                      t.id === tier.id ? { ...t, price: Number(e.target.value) } : t
                    )
                  );
                }}
                className={field}
              />
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
                Önerilen
              </label>
              {draft.tiers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setTiers(draft.tiers.filter((t) => t.id !== tier.id))}
                  className="inline-flex items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                  aria-label={`${tier.name || 'Planı'} sil`}
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              ) : (
                <span />
              )}
              {ti === 0 && tier.price > 199 ? (
                <p className="sm:col-span-4 text-xs text-zinc-500">
                  Giriş planını erişilebilir tutmak dönüşümü artırır.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-200">Özellik karşılaştırması</p>
          <button
            type="button"
            onClick={() => {
              const row: FeatureMatrixRow = {
                id: listingUid('row'),
                label: '',
                values: draft.tiers.map(() => ''),
                inAllPlans: false,
              };
              update({ matrix: [...draft.matrix, row] });
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Satır ekle
          </button>
        </div>
        <p className="mb-4 text-xs text-zinc-600">
          Somut değerler yazın (5 / 25 / Sınırsız). Tüm planlarda aynıysa kutuyu işaretleyin.
        </p>
        {draft.matrix.length === 0 ? (
          <p className="text-sm text-zinc-600">Henüz satır yok. Karşılaştırma için satır ekleyin.</p>
        ) : (
          <div className="space-y-3 overflow-x-auto">
            {draft.matrix.map((row) => (
              <div key={row.id} className="min-w-[28rem] space-y-2 rounded-xl border border-white/[0.08] p-3">
                <div className="flex gap-2">
                  <input
                    value={row.label}
                    onChange={(e) => {
                      update({
                        matrix: draft.matrix.map((r) =>
                          r.id === row.id ? { ...r, label: e.target.value } : r
                        ),
                      });
                    }}
                    className={field}
                    placeholder="Özellik adı"
                  />
                  <button
                    type="button"
                    onClick={() => update({ matrix: draft.matrix.filter((r) => r.id !== row.id) })}
                    className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                    aria-label="Satırı sil"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </button>
                </div>
                {!row.inAllPlans ? (
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${draft.tiers.length}, 1fr)` }}>
                    {draft.tiers.map((t, ti) => (
                      <input
                        key={t.id}
                        value={row.values[ti] ?? ''}
                        onChange={(e) => {
                          update({
                            matrix: draft.matrix.map((r) => {
                              if (r.id !== row.id) return r;
                              const values = [...r.values];
                              values[ti] = e.target.value;
                              return { ...r, values };
                            }),
                          });
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
                      update({
                        matrix: draft.matrix.map((r) =>
                          r.id === row.id ? { ...r, inAllPlans: e.target.checked } : r
                        ),
                      });
                    }}
                  />
                  Tüm planlarda aynı
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
