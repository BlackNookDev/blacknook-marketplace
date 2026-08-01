import Link from 'next/link';
import AccountSection from '@/components/account/AccountSection';

export default function AccountRewardsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ödüller
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Ödül puanları"
          description="Kurulum talepleri ve marketplace etkileşimleriyle puan kazanın."
        >
          <p className="font-display text-4xl font-bold text-white">0 puan</p>
        </AccountSection>

        <AccountSection
          title="Nasıl kazanılır?"
          description="İlk kurulum talebinizi gönderin, eşleşmeye katılın ve yeni servisleri keşfedin."
        >
          <Link
            href="/services"
            className="inline-flex rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Keşfetmeye başla
          </Link>
        </AccountSection>
      </div>
    </div>
  );
}
