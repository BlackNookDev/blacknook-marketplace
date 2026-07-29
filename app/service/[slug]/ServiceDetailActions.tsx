'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';

type Props = {
  serviceName: string;
  serviceSlug: string;
};

export default function ServiceDetailActions({ serviceName, serviceSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetForm = () => {
    setRequirements('');
    setCompanyName('');
    setEmail('');
    setError('');
    setSuccess(false);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/installation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug,
          serviceName,
          requirements,
          companyName,
          email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Talep gönderilemedi.');
        return;
      }
      setSuccess(true);
      setTimeout(() => closeModal(), 1800);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-request-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Kapat"
            onClick={closeModal}
          />

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: duration.base, ease: easePremium }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[var(--bn-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleSubmit} className="relative p-8 pt-10">
              <h2 id="install-request-title" className="text-xl font-bold text-white pr-10">
                Kurulum Talep Et
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                <span className="text-zinc-300 font-medium">{serviceName}</span> için kurulum
                ihtiyacınızı yazın; en kısa sürede{' '}
                <span className="text-zinc-300">dev@blacknook.com</span> üzerinden size dönüş
                yapacağız.
              </p>

              {success ? (
                <p className="mt-8 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200">
                  Talebiniz gönderildi. Teşekkürler!
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="install-requirements" className="sr-only">
                      Kurulum talebi detayı
                    </label>
                    <textarea
                      id="install-requirements"
                      required
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder={`${serviceName} kurulumu için gereksinimlerinizi yazın…`}
                      className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="install-company" className="sr-only">
                      Şirket adı
                    </label>
                    <input
                      id="install-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Şirket Adı"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="install-email" className="sr-only">
                      E-posta
                    </label>
                    <input
                      id="install-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/20"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={sending}
                      className="flex-1 rounded-xl border border-white/10 bg-zinc-900/50 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800/80 transition-colors disabled:opacity-50"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-black py-3 text-sm font-semibold text-white hover:bg-zinc-950 hover:border-white/25 disabled:opacity-50 transition-all"
                    >
                      <Send className="h-4 w-4" aria-hidden />
                      {sending ? 'Gönderiliyor…' : 'Talebi Gönder'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <m.button
        type="button"
        whileTap={{ scale: 0.98 }}
        className="group relative w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90"
        onClick={() => setOpen(true)}
      >
        Kurulum talep et
      </m.button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
