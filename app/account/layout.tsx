import type { Metadata } from 'next';
import AccountGate from '@/components/account/AccountGate';
import AccountSidebar from '@/components/account/AccountSidebar';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hesabım | Blacknook',
  description: 'Profil, ürünler, ödeme ve faturalama ayarlarınızı yönetin.',
  path: '/account',
  noIndex: true,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountGate>
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:gap-12 lg:gap-16">
          <AccountSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
    </AccountGate>
  );
}
