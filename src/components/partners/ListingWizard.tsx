'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  discardBrowserListingDraft,
  emptyListingDraft,
  LISTING_STEPS,
  normalizeListingDraft,
  type ListingDraft,
  type ListingStepId,
} from '@/lib/listingDraft';
import { apiFetch } from '@/lib/apiUrl';
import StepBasic from '@/components/partners/steps/StepBasic';
import StepMedia from '@/components/partners/steps/StepMedia';
import StepFeatures from '@/components/partners/steps/StepFeatures';
import StepPricing from '@/components/partners/steps/StepPricing';
import StepStory from '@/components/partners/steps/StepStory';
import StepTrust from '@/components/partners/steps/StepTrust';
import StepFaq from '@/components/partners/steps/StepFaq';
import StepReview from '@/components/partners/steps/StepReview';

export default function ListingWizard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<ListingStepId>('basic');
  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const draftRef = useRef<ListingDraft | null>(null);
  const loadedRef = useRef(false);
  const dirtyRef = useRef(false);
  const submittingRef = useRef(false);

  const role = session?.user?.role || 'user';

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const persistToDb = useCallback(async (current: ListingDraft, flash: boolean) => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/listing-draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing: current }),
      });
      if (!res.ok) return false;
      dirtyRef.current = false;
      if (flash) {
        setSavedFlash(true);
        window.setTimeout(() => setSavedFlash(false), 1600);
      }
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    discardBrowserListingDraft();
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/listing-draft');
        const data = (await res.json().catch(() => ({}))) as { draft?: ListingDraft | null };
        if (cancelled) return;
        setDraft(data.draft ? normalizeListingDraft(data.draft) : emptyListingDraft());
      } catch {
        if (!cancelled) setDraft(emptyListingDraft());
      } finally {
        if (!cancelled) loadedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loadedRef.current || !draft || !dirtyRef.current || submittingRef.current) return;
    const timer = window.setTimeout(() => {
      const current = draftRef.current;
      if (!current || !dirtyRef.current) return;
      void persistToDb(current, false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draft, persistToDb]);

  const update = useCallback((patch: Partial<ListingDraft>) => {
    dirtyRef.current = true;
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const persist = () => {
    const current = draftRef.current;
    if (!current) return;
    dirtyRef.current = true;
    void persistToDb(current, true);
  };

  const stepIndex = LISTING_STEPS.findIndex((s) => s.id === step);

  const go = (dir: -1 | 1) => {
    const current = draftRef.current;
    if (current && dirtyRef.current) void persistToDb(current, false);
    const next = LISTING_STEPS[stepIndex + dir];
    if (next) setStep(next.id);
  };

  const submit = async () => {
    if (!draft || submitting) return;
    setSubmitError('');
    if (!draft.productName.trim()) {
      setSubmitError('Ürün adı gerekli.');
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const res = await apiFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing: draft }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        status?: string;
        slug?: string;
      };
      if (!res.ok) {
        setSubmitError(data.error || 'Ürün gönderilemedi.');
        submittingRef.current = false;
        setSubmitting(false);
        return;
      }
      await apiFetch('/api/listing-draft', { method: 'DELETE' });
      discardBrowserListingDraft();
      router.push(
        data.status === 'approved' && data.slug
          ? `/service/${data.slug}`
          : '/partners/listings'
      );
    } catch {
      setSubmitError('Bağlantı hatası. Tekrar deneyin.');
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-zinc-500">Taslak yükleniyor…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:gap-12">
      <aside className="lg:w-56 lg:shrink-0">
        <Link
          href="/sell"
          className="mb-6 inline-flex text-xs font-medium text-zinc-500 hover:text-zinc-300"
        >
          ← Partner programı
        </Link>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Partners · Ürün
        </p>
        <nav aria-label="Ürün oluşturma adımları" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          {LISTING_STEPS.map((s, i) => {
            const active = s.id === step;
            const done = i < stepIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  const current = draftRef.current;
                  if (current && dirtyRef.current) void persistToDb(current, false);
                  setStep(s.id);
                }}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-white/[0.08] font-semibold text-white'
                    : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    done
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : active
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-zinc-500'
                  )}
                >
                  {done ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-6 hidden text-xs text-zinc-600 lg:block">
          {savedFlash ? (
            <span className="text-emerald-400">Hesabınıza kaydedildi</span>
          ) : saving ? (
            <span>Kaydediliyor…</span>
          ) : (
            <span>Taslak hesabınıza kaydedilir</span>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ürün oluştur
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            {role === 'admin'
              ? 'Admin olarak gönderdiğiniz ürün hemen pazaryerinde, açık kaynak listesinin önünde yayınlanır.'
              : 'Görseller, fiyat ve hikâyeyi doldurup gönderin. Admin onayından sonra ürününüz katalogda önde sergilenir.'}
          </p>
        </header>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8">
          {step === 'basic' ? <StepBasic draft={draft} update={update} /> : null}
          {step === 'media' ? <StepMedia draft={draft} update={update} /> : null}
          {step === 'features' ? <StepFeatures draft={draft} update={update} /> : null}
          {step === 'pricing' ? <StepPricing draft={draft} update={update} /> : null}
          {step === 'story' ? <StepStory draft={draft} update={update} /> : null}
          {step === 'trust' ? <StepTrust draft={draft} update={update} /> : null}
          {step === 'faq' ? <StepFaq draft={draft} update={update} /> : null}
          {step === 'review' ? <StepReview draft={draft} /> : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={stepIndex === 0}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-200 hover:bg-white/[0.04] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Geri
          </button>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={persist}
              disabled={saving}
              className="inline-flex h-11 items-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-200 hover:bg-white/[0.04]"
            >
              {saving ? 'Kaydediliyor…' : 'Taslağı kaydet'}
            </button>
            {submitError ? (
              <p className="self-center text-xs text-rose-300">{submitError}</p>
            ) : null}
            {step === 'review' ? (
              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitting || !draft.productName.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Gönderiliyor…
                  </>
                ) : (
                  'İncelemeye gönder'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
              >
                Devam
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
