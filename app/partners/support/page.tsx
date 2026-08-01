import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalSupportContent from '@/components/partners/portal/PortalSupportContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Destek | Partner Portal',
  description: 'Blacknook partner portal destek merkezi.',
  path: '/partners/support',
  noIndex: true,
});

/** Destek onay öncesi de açık */
export default function PartnersSupportPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Destek">
        <PortalSupportContent />
      </PartnerPortalShell>
    </DemoGate>
  );
}
