import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:gap-10">
        <div>
          <BrandLogo textClassName="text-xl" iconClassName="h-8 w-8" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            Yönetilen servis kataloğu ve marketplace. Premium araçları keşfedin, kurulum talep edin.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            İletişim
          </h4>
          <a
            href="mailto:contact@blacknook.com"
            className="text-sm text-zinc-400 transition-colors duration-premium ease-premium hover:text-zinc-100"
          >
            contact@blacknook.com
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/[0.06] px-6 py-5 sm:flex-row">
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} BlackNOOK. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
