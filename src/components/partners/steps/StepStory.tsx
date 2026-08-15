import {
  FUNDING,
  STAGES,
  TEAM_SIZES,
  charHint,
  type ListingDraft,
} from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepStory({ draft, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Ürün hikayesi</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Ürünü neden yaptığınızı ve kime hitap ettiğini kendi cümlelerinizle anlatın.
        </p>
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <label htmlFor="story-h" className="text-sm font-medium text-zinc-300">
            Başlık
          </label>
          <span className="text-[11px] text-zinc-600">
            {charHint(draft.storyHeadline.length, 64)}
          </span>
        </div>
        <input
          id="story-h"
          maxLength={64}
          value={draft.storyHeadline}
          onChange={(e) => update({ storyHeadline: e.target.value })}
          className={field}
          placeholder="Neden bunu yaptık"
        />
      </div>

      <div>
        <label htmlFor="narrative" className="mb-2 block text-sm font-medium text-zinc-300">
          Kurucu anlatısı
        </label>
        <textarea
          id="narrative"
          rows={8}
          value={draft.founderNarrative}
          onChange={(e) => update({ founderNarrative: e.target.value })}
          className="w-full resize-y rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
          placeholder="En az iki paragraf: neden yaptınız, kim için, ürün nereye gidiyor."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Ad</label>
          <input
            value={draft.founderName}
            onChange={(e) => update({ founderName: e.target.value })}
            className={field}
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Rol</label>
          <input
            value={draft.founderRole}
            onChange={(e) => update({ founderRole: e.target.value })}
            className={field}
            placeholder="Kurucu"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-300">LinkedIn</label>
          <input
            type="url"
            value={draft.linkedinUrl}
            onChange={(e) => update({ linkedinUrl: e.target.value })}
            className={field}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Kuruluş yılı</label>
          <input
            value={draft.foundedYear}
            onChange={(e) => update({ foundedYear: e.target.value })}
            className={field}
            placeholder="2024"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Merkez</label>
          <input
            value={draft.headquarters}
            onChange={(e) => update({ headquarters: e.target.value })}
            className={field}
            placeholder="İstanbul"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Ekip</label>
          <select
            value={draft.teamSize}
            onChange={(e) => update({ teamSize: e.target.value })}
            className={field}
          >
            {TEAM_SIZES.map((o) => (
              <option key={o} value={o} className="bg-zinc-900">
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">Aşama</label>
          <select
            value={draft.stage}
            onChange={(e) => update({ stage: e.target.value })}
            className={field}
          >
            {STAGES.map((o) => (
              <option key={o} value={o} className="bg-zinc-900">
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Finansman</label>
          <select
            value={draft.funding}
            onChange={(e) => update({ funding: e.target.value })}
            className={field}
          >
            {FUNDING.map((o) => (
              <option key={o} value={o} className="bg-zinc-900">
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
