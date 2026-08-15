import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalListingsContent from '@/components/partners/portal/PortalListingsContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Listeler | Partner Portal',
  description: 'Blacknook partner ürün listeleri.',
  path: '/partners/listings',
  noIndex: true,
});

export default function PartnersListingsPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Listeler">
        <PortalListingsContent />
      </PartnerPortalShell>
    </DemoGate>
  );
}
