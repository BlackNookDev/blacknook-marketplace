import { Plus, Trash2 } from 'lucide-react';
import { charHint, type FeatureStory, type ListingDraft } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepFeatures({ draft, update }: Props) {
  const setStories = (stories: FeatureStory[]) => update({ stories });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Öne çıkan özellikler</h2>
        <p className="mt-1 text-sm text-zinc-500">
          2–4 hikaye. Önce sonuç, sonra mekanizma. Her hikaye bir ekran görüntüsüyle eşleşir.
        </p>
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <label htmlFor="feat-header" className="text-sm font-medium text-zinc-300">
            Bölüm başlığı
          </label>
          <span className="text-[11px] text-zinc-600">
            {charHint(draft.featuresSectionHeader.length, 255)}
          </span>
        </div>
        <input
          id="feat-header"
          maxLength={255}
          value={draft.featuresSectionHeader}
          onChange={(e) => update({ featuresSectionHeader: e.target.value })}
          className={field}
          placeholder="Ekiplerin tercih ettiği her şey, tek yerde"
        />
      </div>

      <div className="space-y-6">
        {draft.stories.map((story, si) => (
          <div
            key={story.id}
            className="space-y-4 border-t border-white/[0.08] pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-200">Hikaye {si + 1}</p>
              {draft.stories.length > 2 ? (
                <button
                  type="button"
                  onClick={() => setStories(draft.stories.filter((_, i) => i !== si))}
                  className="inline-flex items-center gap-1 text-xs text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Kaldır
                </button>
              ) : null}
            </div>
            <input
              maxLength={255}
              value={story.title}
              onChange={(e) => {
                const stories = draft.stories.map((s, i) =>
                  i === si ? { ...s, title: e.target.value } : s
                );
                setStories(stories);
              }}
              className={field}
              placeholder="Fayda başlığı (özellik adı değil)"
            />
            <div className="space-y-2">
              {story.bullets.map((b, bi) => (
                <input
                  key={bi}
                  maxLength={500}
                  value={b}
                  onChange={(e) => {
                    const stories = draft.stories.map((s, i) => {
                      if (i !== si) return s;
                      const bullets = [...s.bullets];
                      bullets[bi] = e.target.value;
                      return { ...s, bullets };
                    });
                    setStories(stories);
                  }}
                  className={field}
                  placeholder="**Fiil** ile başlayan madde"
                />
              ))}
              {story.bullets.length < 5 ? (
                <button
                  type="button"
                  className="text-xs font-medium text-sky-400"
                  onClick={() => {
                    const stories = draft.stories.map((s, i) =>
                      i === si ? { ...s, bullets: [...s.bullets, ''] } : s
                    );
                    setStories(stories);
                  }}
                >
                  + Madde
                </button>
              ) : null}
            </div>
            <input
              value={story.screenshotNote}
              onChange={(e) => {
                const stories = draft.stories.map((s, i) =>
                  i === si ? { ...s, screenshotNote: e.target.value } : s
                );
                setStories(stories);
              }}
              className={field}
              placeholder="Eşleşen ekran görüntüsü notu"
            />
          </div>
        ))}
      </div>

      {draft.stories.length < 4 ? (
        <button
          type="button"
          onClick={() =>
            setStories([
              ...draft.stories,
              {
                id: `story_${Date.now()}`,
                title: '',
                bullets: ['', ''],
                screenshotNote: '',
              },
            ])
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Hikaye ekle
        </button>
      ) : null}
    </div>
  );
}
