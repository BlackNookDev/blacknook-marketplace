import { Plus, Trash2 } from 'lucide-react';
import { listingUid, type FaqItem, type ListingDraft } from '@/lib/listingDraft';
import { FieldLabel } from '@/components/partners/FieldHint';

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
        <p className="mt-1 text-sm text-zinc-500">Zorunlu değil. Soru yazdıysanız yanıtı da yazın.</p>
      </div>

      {draft.faqs.length === 0 ? (
        <p className="text-sm text-zinc-600">Soru yok. İsterseniz ekleyin, yoksa devam edin.</p>
      ) : null}

      <div className="space-y-6">
        {draft.faqs.map((faq, fi) => (
          <div
            key={faq.id}
            className="space-y-3 border-t border-white/[0.08] pt-6 first:border-t-0 first:pt-0"
          >
            <div className="flex justify-between">
              <FieldLabel required hint="Yanıtsız soru gönderilemez.">
                Soru {fi + 1}
              </FieldLabel>
              <button
                type="button"
                onClick={() => setFaqs(draft.faqs.filter((f) => f.id !== faq.id))}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="inline h-3.5 w-3.5" aria-hidden />
                Sil
              </button>
            </div>
            <input
              maxLength={255}
              value={faq.question}
              onChange={(e) => {
                setFaqs(
                  draft.faqs.map((f) => (f.id === faq.id ? { ...f, question: e.target.value } : f))
                );
              }}
              className={field}
              placeholder="Kurulum ne kadar sürer?"
            />
            <textarea
              rows={3}
              value={faq.answer}
              onChange={(e) => {
                setFaqs(
                  draft.faqs.map((f) => (f.id === faq.id ? { ...f, answer: e.target.value } : f))
                );
              }}
              className="w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              placeholder="Yanıt"
            />
          </div>
        ))}
      </div>

      {draft.faqs.length < 8 ? (
        <button
          type="button"
          onClick={() =>
            setFaqs([
              ...draft.faqs,
              { id: listingUid('faq'), question: '', answer: '', linkLabel: '', linkUrl: '' },
            ])
          }
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Soru ekle
        </button>
      ) : null}
    </div>
  );
}
