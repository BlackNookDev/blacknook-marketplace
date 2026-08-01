import AccountSection from '@/components/account/AccountSection';

export default function AccountMembershipPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Plus üyelik
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Blacknook Plus"
          description="Erken erişim, öncelikli kurulum desteği ve özel fırsat uyarıları."
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-400">Mevcut plan</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">Ücretsiz</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>• Marketplace kataloğuna erişim</li>
              <li>• Kurulum talebi gönderme</li>
              <li>• Geliştirici eşleşmesi</li>
            </ul>
            <button
              type="button"
              className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Plus&apos;a yükselt
            </button>
          </div>
        </AccountSection>
      </div>
    </div>
  );
}
