import { Plus, Trash2 } from 'lucide-react';
import { charHint, listingUid, type FeatureStory, type ListingDraft } from '@/lib/listingDraft';

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
          1–4 özellik grubu ekleyin. Önce sonucu, sonra nasıl çalıştığını yazın.
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
          placeholder="Ekiplerin ihtiyaç duyduğu her şey, tek yerde"
        />
      </div>

      <div className="space-y-6">
        {draft.stories.map((story, si) => (
          <div
            key={story.id}
            className="space-y-4 border-t border-white/[0.08] pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-200">Özellik {si + 1}</p>
              {draft.stories.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setStories(draft.stories.filter((s) => s.id !== story.id))}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Sil
                </button>
              ) : null}
            </div>
            <input
              maxLength={255}
              value={story.title}
              onChange={(e) => {
                setStories(
                  draft.stories.map((s) => (s.id === story.id ? { ...s, title: e.target.value } : s))
                );
              }}
              className={field}
              placeholder="Fayda başlığı (ör. Tek tıkla yedekleme)"
            />
            <div className="space-y-2">
              {story.bullets.map((b, bi) => (
                <div key={`${story.id}-b-${bi}`} className="flex gap-2">
                  <input
                    maxLength={500}
                    value={b}
                    onChange={(e) => {
                      setStories(
                        draft.stories.map((s) => {
                          if (s.id !== story.id) return s;
                          const bullets = [...s.bullets];
                          bullets[bi] = e.target.value;
                          return { ...s, bullets };
                        })
                      );
                    }}
                    className={field}
                    placeholder="Somut bir madde yazın"
                  />
                  {story.bullets.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStories(
                          draft.stories.map((s) =>
                            s.id === story.id
                              ? { ...s, bullets: s.bullets.filter((_, idx) => idx !== bi) }
                              : s
                          )
                        );
                      }}
                      className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-white/10 px-3 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
                      aria-label="Maddeyi sil"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Sil
                    </button>
                  ) : null}
                </div>
              ))}
              {story.bullets.length < 5 ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
                  onClick={() => {
                    setStories(
                      draft.stories.map((s) =>
                        s.id === story.id ? { ...s, bullets: [...s.bullets, ''] } : s
                      )
                    );
                  }}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  Madde ekle
                </button>
              ) : null}
            </div>
            <input
              value={story.screenshotNote}
              onChange={(e) => {
                setStories(
                  draft.stories.map((s) =>
                    s.id === story.id ? { ...s, screenshotNote: e.target.value } : s
                  )
                );
              }}
              className={field}
              placeholder="Bu özelliğe denk gelen ekran görüntüsü notu (opsiyonel)"
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
                id: listingUid('story'),
                title: '',
                bullets: [''],
                screenshotNote: '',
              },
            ])
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Özellik ekle
        </button>
      ) : null}
    </div>
  );
}
