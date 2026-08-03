'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Globe2,
  Layers,
  Megaphone,
  Rocket,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const PILLARS = [
  {
    icon: Layers,
    title: 'Seçilmiş katalog',
    body: 'Blacknook Select, yalnızca güçlü ürün-pazar uyumu gösteren yazılımları özel lansmanla öne çıkarır.',
  },
  {
    icon: Globe2,
    title: 'Dağıtım ağı',
    body: 'Ekosistem alıcıları, partner kanalları ve keşif yüzeylerinde ürününüzü doğru bağlamda konumlarız.',
  },
  {
    icon: Target,
    title: 'KOBİ odaklı büyüme',
    body: 'Küçük ekipler ve girişimlerin gerçek iş ihtiyaçlarına göre kampanya ve mesajlaşmayı birlikte kurarız.',
  },
];

const STATS = [
  { k: 'Özel lansman', v: 'Select cohort’ları' },
  { k: 'Moderasyon', v: 'Kalite öncelikli seçim' },
  { k: 'Peşin maliyet yok', v: 'Başarıyla birlikte büyüme' },
  { k: 'Partner odaklı', v: 'Strateji + yayın desteği' },
];

const STEPS = [
  {
    n: '01',
    title: 'Seçim',
    body: 'Başvurular incelenir. Select’e yalnızca ürünü, desteği ve pazaryeri uyumu net olan ekipler alınır.',
  },
  {
    n: '02',
    title: 'Geri bildirim',
    body: 'Listeleme, plan yapısı ve kurulum mesajları için ürününüze odaklı geri bildirim veririz.',
  },
  {
    n: '03',
    title: 'Strateji',
    body: 'Lansman kurgusu, konumlandırma ve görünürlük planını birlikte netleştiririz.',
  },
  {
    n: '04',
    title: 'Lansman',
    body: 'Ürününüz Blacknook Select vitrininde ve ilgili keşif yüzeylerinde öne çıkar.',
  },
  {
    n: '05',
    title: 'Ölçek',
    body: 'İlk kullanıcı sinyali, geri bildirim ve tekrar ziyaretlerle sürdürülebilir büyümeye geçersiniz.',
  },
];

const OUTCOMES = [
  {
    icon: Sparkles,
    title: 'Select partneri ol',
    body: 'Başvuranların yalnızca küçük bir kısmı Select lansmanına alınır. Odak: kalite, hazırlık ve uzun vadeli destek.',
  },
  {
    icon: Megaphone,
    title: 'Marka görünürlüğü',
    body: 'Kataloğun ötesinde Select yerleşimleri, duyurular ve partner iletişimiyle ürününüzü tanıtın.',
  },
  {
    icon: Rocket,
    title: 'Kategori ivmesi',
    body: 'Hedef alıcı kitlesine kısa sürede ulaşın; kurulum talepleri ve gerçek kullanım sinyali toplayın.',
  },
];

const QUOTES = [
  {
    quote:
      'Select süreci listelemeyi hızlandırmadı; mesajımızı da netleştirdi. Doğru alıcılarla konuşmaya başladık.',
    name: 'Elif K.',
    role: 'Kurucu · B2B otomasyon',
  },
  {
    quote:
      'Peşin pazarlama bütçesi olmadan vitrinde yer almak kritik oldu. Geri bildirimler yol haritamızı değiştirdi.',
    name: 'Mert A.',
    role: 'Indie geliştirici · Developer tools',
  },
];

export default function SelectContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pb-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(45,212,191,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bn-bg,#161618)] to-transparent" />
        </div>

        <m.div
          className="relative z-10 mx-auto max-w-4xl text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.scene, ease: easePremium }}
        >
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-zinc-900/80 shadow-lg">
            <Image
              src="/bn-mark.png"
              alt="Blacknook"
              width={28}
              height={28}
              className="h-7 w-7 object-contain brightness-0 invert"
              priority
            />
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300/80">
            Blacknook Select · 2026
          </p>
          <h1 className="font-display text-[clamp(2.25rem,5.8vw,4rem)] font-bold leading-[1.05] tracking-tight text-white">
            Daha hızlı ölçeklenin.
            <span className="mt-1 block text-zinc-400">Doğru kitleye çıkın.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Blacknook Select; seçilmiş SaaS ve yazılım ürünleri için özel lansman, strateji ve
            görünürlük programıdır. Peşin maliyet yok.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/partners/self-submission"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              Select’e başvur
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#surec"
              className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.07]"
            >
              Süreci gör
            </a>
          </div>
        </m.div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Blacknook Select nedir?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-500">
              Standart listelemenin ötesinde: kürasyon, lansman kurgusu ve büyüme eşliği.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map((item, i) => (
              <m.div
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: duration.base, ease: easePremium, delay: i * 0.06 }}
              >
                <item.icon className="h-5 w-5 text-teal-300/90" aria-hidden />
                <h3 className="mt-4 font-display text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.body}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.02] px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k}>
              <p className="font-display text-lg font-bold text-white">{s.k}</p>
              <p className="mt-1 text-sm text-zinc-500">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="surec" className="scroll-mt-24 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ürününüz. Bizim ekibimiz.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
              Başvurudan ölçeğe beş adımlık Select yolu.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <m.li
                key={step.n}
                className="relative rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-5"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: duration.base, ease: easePremium, delay: i * 0.05 }}
              >
                <span className="font-display text-xs font-bold tabular-nums text-teal-300/80">
                  {step.n}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">{step.body}</p>
              </m.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              En büyük kampanyanız — sizin için.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
              Peşin ücret yok. Select’e seçilirseniz lansmanı birlikte yürütürüz.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {OUTCOMES.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
              >
                <item.icon className="h-5 w-5 text-zinc-300" aria-hidden />
                <h3 className="mt-4 font-display text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center justify-center gap-2 text-zinc-500">
            <Users className="h-4 w-4" aria-hidden />
            <p className="text-sm font-medium">Partnerlerden notlar</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {QUOTES.map((q) => (
              <blockquote
                key={q.name}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
              >
                <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">“{q.quote}”</p>
                <footer className="mt-5">
                  <p className="text-sm font-semibold text-white">{q.name}</p>
                  <p className="text-xs text-zinc-500">{q.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-6 py-12 text-center sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300/80">
            Blacknook Select · 2026
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
            Select sınıfına katıl
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
            Ürününüzü incelemeye gönderin. Select’e uygun görülürseniz lansman sürecini birlikte
            planlarız.
          </p>
          <Link
            href="/partners/self-submission"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Şimdi başvur
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="mt-6 text-sm text-zinc-600">
            Henüz Select için hazır değil misiniz?{' '}
            <Link href="/sell" className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
              Standart partner programı
            </Link>
            {' · '}
            <Link
              href="/partners/self-submission"
              className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200"
            >
              Ürününü listele
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
