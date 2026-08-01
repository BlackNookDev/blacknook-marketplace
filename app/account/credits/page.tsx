import Link from 'next/link';
import AccountSection from '@/components/account/AccountSection';

export default function AccountCreditsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Kredi & hediye kartları
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Bakiye"
          description="Hesabınızdaki Blacknook kredileri satın alımlarda kullanılabilir."
        >
          <p className="font-display text-4xl font-bold text-white">₺0</p>
          <button
            type="button"
            className="mt-5 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            + Kredi ekle
          </button>
        </AccountSection>

        <AccountSection
          title="Hediye kartı"
          description="Hediye kartı kodunuzu buraya girerek bakiyenize ekleyin."
        >
          <div className="flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-xl border border-white/15 bg-white px-4 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Kullan
            </button>
          </div>
        </AccountSection>

        <AccountSection title="Geçmiş">
          <p className="text-sm text-zinc-500">
            Henüz kredi hareketi yok.{' '}
            <Link href="/services" className="text-sky-400 hover:text-sky-300">
              Servislere göz at
            </Link>
          </p>
        </AccountSection>
      </div>
    </div>
  );
}
