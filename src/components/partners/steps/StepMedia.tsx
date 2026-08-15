'use client';

import { Plus, Trash2 } from 'lucide-react';
import { charHint, type ListingDraft } from '@/lib/listingDraft';
import ImageUploadField from '@/components/partners/ImageUploadField';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepMedia({ draft, update }: Props) {
  const shots = Math.max(draft.screenshotData.length, draft.screenshotAlts.length, 1);
  const screenshotData = pad(draft.screenshotData, shots);
  const screenshotAlts = pad(draft.screenshotAlts, shots);
  const screenshotNotes = pad(draft.screenshotNotes, shots);

  const setShots = (data: string[], alts: string[], notes: string[]) => {
    update({ screenshotData: data, screenshotAlts: alts, screenshotNotes: notes });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Medya</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Logo, kapak ve ürün ekran görüntülerini yükleyin. Dosyalar sunucuya kaydedilir.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUploadField
          label="Ürün ikonu"
          help="Kare, 512×512 önerilir. Yalnızca logo."
          value={draft.companyIconData}
          onChange={(companyIconData) => update({ companyIconData })}
          aspectClass="aspect-square max-h-56"
        />
        <ImageUploadField
          label="Yatay logo (opsiyonel)"
          help="Logo + ürün adı yan yana."
          value={draft.wordmarkData}
          onChange={(wordmarkData) => update({ wordmarkData })}
          aspectClass="aspect-[2.4/1] max-h-40"
        />
      </div>

      <div>
        <ImageUploadField
          label="Kapak görseli"
          help="16:9, temiz ürün arayüzü. Ağır yazı katmanı olmasın."
          value={draft.heroImageData}
          onChange={(heroImageData) => update({ heroImageData })}
          aspectClass="aspect-video"
        />
        <div className="mt-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label htmlFor="hero-alt" className="text-xs text-zinc-500">
              Kapak görseli açıklaması
            </label>
            <span className="text-[11px] text-zinc-600">{charHint(draft.heroAlt.length, 255)}</span>
          </div>
          <input
            id="hero-alt"
            maxLength={255}
            value={draft.heroAlt}
            onChange={(e) => update({ heroAlt: e.target.value })}
            className={field}
            placeholder="Örn. Ana pano görünümü"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-zinc-300">Ürün ekran görüntüleri</p>
          {shots < 8 ? (
            <button
              type="button"
              onClick={() =>
                setShots([...screenshotData, ''], [...screenshotAlts, ''], [...screenshotNotes, ''])
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Görsel ekle
            </button>
          ) : null}
        </div>
        <p className="mb-4 text-xs text-zinc-600">
          En fazla 8 görsel. Her görsel bir özelliği göstersin.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {screenshotData.map((value, i) => (
            <div key={`shot-${i}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-300">Ekran {i + 1}</p>
                {shots > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShots(
                        screenshotData.filter((_, idx) => idx !== i),
                        screenshotAlts.filter((_, idx) => idx !== i),
                        screenshotNotes.filter((_, idx) => idx !== i)
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-300 hover:text-rose-200"
                    aria-label={`Ekran ${i + 1} alanını kaldır`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Sil
                  </button>
                ) : null}
              </div>
              <ImageUploadField
                label=""
                value={value}
                onChange={(dataUrl) => {
                  const next = [...screenshotData];
                  next[i] = dataUrl;
                  setShots(next, screenshotAlts, screenshotNotes);
                }}
                aspectClass="aspect-video"
              />
              <input
                value={screenshotAlts[i] || ''}
                onChange={(e) => {
                  const next = [...screenshotAlts];
                  next[i] = e.target.value;
                  setShots(screenshotData, next, screenshotNotes);
                }}
                className={field}
                placeholder="Kısa açıklama (alt metin)"
                maxLength={255}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function pad(list: string[] | undefined, length: number) {
  const next = [...(list || [])];
  while (next.length < length) next.push('');
  return next.slice(0, length);
}
