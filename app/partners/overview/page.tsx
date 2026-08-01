import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalOverviewContent from '@/components/partners/portal/PortalOverviewContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kontrol Paneli | Partner Portal',
  description: 'Blacknook partner portalı kontrol paneli.',
  path: '/partners/overview',
  noIndex: true,
});

/** Giriş yeterli — içerik rolüne göre kademeli açılır */
export default function PartnersOverviewPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Kontrol Paneli">
        <PortalOverviewContent />
      </PartnerPortalShell>
    </DemoGate>
  );
}
