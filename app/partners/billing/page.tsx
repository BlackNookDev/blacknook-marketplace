import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import { PartnerFeatureGate } from '@/components/partners/portal/PartnerAccess';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalBillingContent from '@/components/partners/portal/PortalBillingContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Faturalandırma | Partner Portal',
  description: 'Blacknook partner faturalandırma ve ödemeler.',
  path: '/partners/billing',
  noIndex: true,
});

export default function PartnersBillingPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Faturalandırma">
        <PartnerFeatureGate title="Faturalandırma">
          <PortalBillingContent />
        </PartnerFeatureGate>
      </PartnerPortalShell>
    </DemoGate>
  );
}
