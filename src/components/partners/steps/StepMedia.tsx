'use client';

import { charHint, type ListingDraft } from '@/lib/listingDraft';
import ImageUploadField from '@/components/partners/ImageUploadField';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepMedia({ draft, update }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Medya</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Şirket ikonu, wordmark, hero ve ürün ekran görüntülerini yükleyin. Dosyalar bu tarayıcıda
          taslak olarak saklanır.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageUploadField
          label="Şirket ikonu"
          help="Kare, 512×512 önerilir. Yalnızca logo markası."
          value={draft.companyIconData}
          onChange={(companyIconData) => update({ companyIconData })}
          aspectClass="aspect-square max-h-56"
        />
        <ImageUploadField
          label="Wordmark (opsiyonel)"
          help="Yatay logo + isim."
          value={draft.wordmarkData}
          onChange={(wordmarkData) => update({ wordmarkData })}
          aspectClass="aspect-[2.4/1] max-h-40"
        />
      </div>

      <div>
        <ImageUploadField
          label="Hero görsel"
          help="16:9, temiz ürün arayüzü. Cihaz çerçevesi ve ağır yazı katmanı olmasın."
          value={draft.heroImageData}
          onChange={(heroImageData) => update({ heroImageData })}
          aspectClass="aspect-video"
        />
        <div className="mt-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <label htmlFor="hero-alt" className="text-xs text-zinc-500">
              Hero alt metin
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
        <p className="mb-2 text-sm font-medium text-zinc-300">Ürün ekran görüntüleri (4)</p>
        <p className="mb-4 text-xs text-zinc-600">
          Her görsel bir özellik hikayesine denk gelsin. Onay için dört görsel hedeflenir.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <ImageUploadField
                label={`Ekran ${i + 1}`}
                value={draft.screenshotData[i] || ''}
                onChange={(dataUrl) => {
                  const screenshotData = [...(draft.screenshotData || ['', '', '', ''])];
                  while (screenshotData.length < 4) screenshotData.push('');
                  screenshotData[i] = dataUrl;
                  update({ screenshotData });
                }}
                aspectClass="aspect-video"
              />
              <input
                value={draft.screenshotAlts[i] || ''}
                onChange={(e) => {
                  const screenshotAlts = [...draft.screenshotAlts];
                  screenshotAlts[i] = e.target.value;
                  update({ screenshotAlts });
                }}
                className={field}
                placeholder={`Alt metin ${i + 1}`}
                maxLength={255}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
