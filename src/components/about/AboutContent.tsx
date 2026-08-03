'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Code2, Compass, Rocket, ShoppingBag, Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';

const MISSION = [
  {
    title: 'Geliştirici odaklı ekosistem',
    body: 'Yazılım üreten topluluklar ile dijital araç arayan kullanıcıları doğrudan buluşturan merkezi bir pazar yeri olmak.',
  },
  {
    title: 'Büyüme ve lansman kaldıracı',
    body: 'Girişimlerin ilk kullanıcılarını kazanmalarına, erken aşama gelir elde etmelerine ve ürünlerini doğrulayacak geri bildirimleri toplamalarına olanak tanımak.',
  },
  {
    title: 'Erişilebilirlik',
    body: 'Kullanıcılara yenilikçi SaaS ve yazılım çözümlerini avantajlı koşullarla keşfetme fırsatı sunmak.',
  },
];

const HOW = [
  {
    icon: Compass,
    title: 'Partner destekli',
    body: 'Bağımsız geliştiriciler ve erken aşama girişimlerle çalışarak yeni nesil araçları tek kataloğda topluyoruz.',
  },
  {
    icon: Rocket,
    title: 'Lansman & listeleme',
    body: 'SaaS, eklenti, kod kütüphanesi ve dijital araçlar sergilenir; ürünler pazara hızlı çıkar.',
  },
  {
    icon: ShoppingBag,
    title: 'Tek noktadan erişim',
    body: 'Alıcılar iş akışını hızlandıracak yazılımları keşfeder, kurulum talep eder ve ekosisteme katılır.',
  },
];

const AUDIENCE = [
  {
    icon: Code2,
    side: 'Geliştiriciler & girişimler',
    points: [
      'Pazarlama bütçesi harcamadan hedef kitleye ulaşma',
      'Yazılım satışından gelir elde etme',
      'Kullanıcı kitlesi ve geri bildirim oluşturma',
    ],
  },
  {
    icon: Users,
    side: 'Alıcılar & profesyoneller',
    points: [
      'Yeni nesil yazılımlara erken erişim',
      'İş akışını hızlandıran dijital araçlar',
      'Tek pazaryerinden keşif ve kurulum talebi',
    ],
  },
];

export default function AboutContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 text-center sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[38%] h-[42vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_68%)] blur-2xl" />
        </div>

        <m.div
          className="relative z-10 mx-auto max-w-4xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.scene, ease: easePremium }}
        >
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-zinc-900/80 shadow-lg">
            <Image
              src="/bn-mark.png"
              alt="Blacknook logosu"
              width={28}
              height={28}
              className="h-7 w-7 object-contain brightness-0 invert"
              priority
            />
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Hakkımızda
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
            Yazılımı büyütenler için
            <span className="mt-1 block text-zinc-400">dijital ürün pazaryeri</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Blacknook; bağımsız yazılımcılar, indie hacker&apos;lar ve erken aşama girişimler için
            geliştirilmiş yazılım ve dijital ürün pazar yeridir. Geliştiricilerin ürünlerini pazara
            sunmasını kolaylaştırır; kullanıcıların yenilikçi araçlara tek noktadan erişmesini sağlar.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Ekosistemi keşfet
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08]"
            >
              Geliştirici olarak katıl
            </Link>
          </div>
        </m.div>
      </section>

      {/* Mission */}
      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Girişimcilik kapısını herkes için açmak
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Temel amacımız geliştiriciler ile dijital araç arayan kullanıcıları buluşturmak; ilk
            kullanıcı, erken gelir ve ürün doğrulaması için güvenilir bir kaldıraç olmak.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {MISSION.map((item, i) => (
              <m.article
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: duration.base, ease: easePremium }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-zinc-50">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.body}</p>
              </m.article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Nasıl çalışır?
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Icon className="h-5 w-5 text-zinc-200" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-50">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Kimler için?
          </h2>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            İki taraf, tek platform: üretenler ve arayanlar.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {AUDIENCE.map(({ icon: Icon, side, points }) => (
              <article
                key={side}
                className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{side}</h3>
                </div>
                <ul className="mt-6 space-y-3">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-zinc-400">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Temel faaliyet alanları
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] p-6">
              <h3 className="font-display text-lg font-semibold text-zinc-50">
                Yazılım listeleme & lansman
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Farklı kategorilerdeki SaaS, eklenti, kod kütüphanesi ve dijital araçların
                sergilenmesi; ürünlerin görünürlük kazanması.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] p-6">
              <h3 className="font-display text-lg font-semibold text-zinc-50">Geliştirici pazarı</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Yazılımcıların ürünlerini ticarileştirebileceği, dinamik bir satış ve keşif
                platformu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ekosisteme katılın
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400">
            Ürününü listelemek veya yeni araçları keşfetmek için Blacknook Marketplace&apos;te yerini
            al.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Servislere göz at
            </Link>
            <a
              href="mailto:contact@blacknook.com"
              className="inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.06]"
            >
              contact@blacknook.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
