import { Plus, Trash2 } from 'lucide-react';
import type { FaqItem, ListingDraft } from '@/lib/listingDraft';

const field =
  'h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10';

type Props = {
  draft: ListingDraft;
  update: (patch: Partial<ListingDraft>) => void;
};

export default function StepFaq({ draft, update }: Props) {
  const setFaqs = (faqs: FaqItem[]) => update({ faqs });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">SSS</h2>
        <p className="mt-1 text-sm text-zinc-500">
          En az 1, önerilen 6–8. Yanıtlar kısa kalsın (en fazla iki cümle). Lifetime erişim, limit,
          export, iade ve destek konularını kapsayın.
        </p>
      </div>

      <div className="space-y-6">
        {draft.faqs.map((faq, fi) => (
          <div
            key={faq.id}
            className="space-y-3 border-t border-white/[0.08] pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex justify-between">
              <p className="text-sm font-semibold text-zinc-200">Soru {fi + 1}</p>
              {draft.faqs.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setFaqs(draft.faqs.filter((_, i) => i !== fi))}
                  className="text-xs text-rose-300"
                >
                  <Trash2 className="inline h-3.5 w-3.5" aria-hidden /> Kaldır
                </button>
              ) : null}
            </div>
            <input
              maxLength={255}
              value={faq.question}
              onChange={(e) => {
                const faqs = draft.faqs.map((f, i) =>
                  i === fi ? { ...f, question: e.target.value } : f
                );
                setFaqs(faqs);
              }}
              className={field}
              placeholder="Soru"
            />
            <textarea
              rows={3}
              value={faq.answer}
              onChange={(e) => {
                const faqs = draft.faqs.map((f, i) =>
                  i === fi ? { ...f, answer: e.target.value } : f
                );
                setFaqs(faqs);
              }}
              className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              placeholder="Kısa yanıt"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={faq.linkLabel}
                onChange={(e) => {
                  const faqs = draft.faqs.map((f, i) =>
                    i === fi ? { ...f, linkLabel: e.target.value } : f
                  );
                  setFaqs(faqs);
                }}
                className={field}
                placeholder="Yardım linki etiketi (ops.)"
                maxLength={64}
              />
              <input
                type="url"
                value={faq.linkUrl}
                onChange={(e) => {
                  const faqs = draft.faqs.map((f, i) =>
                    i === fi ? { ...f, linkUrl: e.target.value } : f
                  );
                  setFaqs(faqs);
                }}
                className={field}
                placeholder="https://"
              />
            </div>
          </div>
        ))}
      </div>

      {draft.faqs.length < 8 ? (
        <button
          type="button"
          onClick={() =>
            setFaqs([
              ...draft.faqs,
              {
                id: `faq_${Date.now()}`,
                question: '',
                answer: '',
                linkLabel: '',
                linkUrl: '',
              },
            ])
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400"
        >
          <Plus className="h-4 w-4" aria-hidden />
          SSS ekle
        </button>
      ) : null}
    </div>
  );
}
