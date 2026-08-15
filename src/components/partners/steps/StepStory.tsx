import type { ListingDraft } from '@/lib/listingDraft';
import { FieldLabel } from '@/components/partners/FieldHint';

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
        <h2 className="font-display text-xl font-semibold text-white">Hikâye</h2>
        <p className="mt-1 text-sm text-zinc-500">Kim yaptı, neden var. Satış vaadi değil.</p>
      </div>

      <div>
        <FieldLabel htmlFor="narrative" required hint="Detay sayfasında bu metin durur.">
          Hikâye
        </FieldLabel>
        <textarea
          id="narrative"
          rows={7}
          value={draft.founderNarrative}
          onChange={(e) => update({ founderNarrative: e.target.value })}
          className="w-full resize-y rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
          placeholder="Ürünü neden yaptınız, kim kullanıyor."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="founder-name" required>
            Ad
          </FieldLabel>
          <input
            id="founder-name"
            value={draft.founderName}
            onChange={(e) => update({ founderName: e.target.value })}
            className={field}
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <FieldLabel htmlFor="founder-role" hint="Kurucu, geliştirici… Boş bırakılabilir.">
            Rol
          </FieldLabel>
          <input
            id="founder-role"
            value={draft.founderRole}
            onChange={(e) => update({ founderRole: e.target.value })}
            className={field}
            placeholder="Kurucu"
          />
        </div>
      </div>
    </div>
  );
}
