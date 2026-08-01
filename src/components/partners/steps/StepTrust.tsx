import type { ListingDraft } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepTrust({ draft, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Güven sinyalleri</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Doğrulama URL’leri. Gerçek linklerinizi yapıştırın; uydurulmuş adres kullanmayın.
        </p>
      </div>

      {(
        [
          ['websiteUrl', 'Ürün / şirket sitesi', 'https://'],
          ['g2Url', 'G2 (opsiyonel)', 'https://www.g2.com/...'],
          ['capterraUrl', 'Capterra (opsiyonel)', 'https://www.capterra.com/...'],
          ['stripeArrUrl', 'Stripe ARR / gelir kanıtı (opsiyonel)', 'https://'],
        ] as const
      ).map(([key, label, ph]) => (
        <div key={key}>
          <label className="mb-2 block text-sm font-medium text-zinc-300">{label}</label>
          <input
            type="url"
            value={draft[key]}
            onChange={(e) => update({ [key]: e.target.value })}
            className={field}
            placeholder={ph}
          />
        </div>
      ))}
    </div>
  );
}
