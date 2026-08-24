import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import { PartnerFeatureGate } from '@/components/partners/portal/PartnerAccess';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalSalesContent from '@/components/partners/portal/PortalSalesContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Satış ve Analitik | Geliştirici paneli',
  description: 'Blacknook partner satış ve analitik paneli.',
  path: '/partners/sales',
  noIndex: true,
});

export default function PartnersSalesPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Satış ve Analitik">
        <PartnerFeatureGate title="Satış ve Analitik">
          <PortalSalesContent />
        </PartnerFeatureGate>
      </PartnerPortalShell>
    </DemoGate>
  );
}
