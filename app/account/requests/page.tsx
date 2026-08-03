import AccountSection from '@/components/account/AccountSection';
import ActiveRequestsSection from '@/components/account/ActiveRequestsSection';

export default function AccountRequestsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Talepler
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Eşleşme ve kurulum taleplerinizi buradan takip edebilirsiniz.
      </p>

      <div className="mt-10">
        <ActiveRequestsSection />

        <AccountSection
          title="Kurulum talepleri"
          description="Servis detayından gönderdiğiniz kurulum talepleri burada listelenir."
        >
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8 text-center">
            <p className="text-sm font-medium text-zinc-300">Kurulum talebi yok</p>
            <p className="mt-1 text-sm text-zinc-500">
              Bir servis sayfasından kurulum talebi gönderdiğinizde burada görünecek.
            </p>
          </div>
        </AccountSection>
      </div>
    </div>
  );
}
