import AccountSection from '@/components/account/AccountSection';

export default function AccountAffiliatePage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Affiliate programı
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Ortaklık"
          description="Blacknook Marketplace’i paylaşın, referanslarınız üzerinden komisyon kazanın."
        >
          <p className="text-sm text-zinc-400">
            Affiliate hesabınız henüz aktif değil. Başvurunuzu gönderdiğinizde referans bağlantınız
            burada görünür.
          </p>
          <button
            type="button"
            className="mt-5 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Affiliate başvurusu yap
          </button>
        </AccountSection>

        <AccountSection title="Referans bağlantısı">
          <input
            type="text"
            readOnly
            value="https://blacknook.com/?ref=sizin-kodunuz"
            className="h-11 w-full max-w-xl rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-zinc-500 outline-none"
          />
        </AccountSection>
      </div>
    </div>
  );
}
