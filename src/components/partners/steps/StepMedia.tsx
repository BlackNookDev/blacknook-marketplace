'use client';

import { Plus, Trash2 } from 'lucide-react';
import { type ListingDraft } from '@/lib/listingDraft';
import ImageUploadField from '@/components/partners/ImageUploadField';
import { FieldLabel } from '@/components/partners/FieldHint';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepMedia({ draft, update }: Props) {
  const shots = Math.max(draft.screenshotData.length, 1);
  const screenshotData = pad(draft.screenshotData, shots);

  const setShots = (data: string[]) => {
    update({ screenshotData: data, screenshotAlts: data.map(() => ''), screenshotNotes: data.map(() => '') });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Görseller</h2>
        <p className="mt-1 text-sm text-zinc-500">Liste ve detay sayfasında bunlar durur.</p>
      </div>

      <ImageUploadField
        label="İkon"
        required
        hint="Kare logo. Kartın solunda görünür."
        value={draft.companyIconData}
        onChange={(companyIconData) => update({ companyIconData })}
        aspectClass="aspect-square max-h-56"
      />

      <ImageUploadField
        label="Kapak"
        required
        hint="Detay sayfasının üstündeki geniş görsel."
        value={draft.heroImageData}
        onChange={(heroImageData) => update({ heroImageData })}
        aspectClass="aspect-video"
      />

      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <FieldLabel required hint="En az bir gerçek ürün ekranı.">
            Ekran görüntüleri
          </FieldLabel>
          {shots < 8 ? (
            <button
              type="button"
              onClick={() => setShots([...screenshotData, ''])}
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Ekle
            </button>
          ) : null}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {screenshotData.map((value, i) => (
            <div key={`shot-${i}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{i + 1}</p>
                {shots > 1 ? (
                  <button
                    type="button"
                    onClick={() => setShots(screenshotData.filter((_, idx) => idx !== i))}
                    className="inline-flex items-center gap-1 text-xs font-medium text-rose-300 hover:text-rose-200"
                    aria-label={`Görsel ${i + 1} kaldır`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Sil
                  </button>
                ) : null}
              </div>
              <ImageUploadField
                value={value}
                onChange={(dataUrl) => {
                  const next = [...screenshotData];
                  next[i] = dataUrl;
                  setShots(next);
                }}
                aspectClass="aspect-video"
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
