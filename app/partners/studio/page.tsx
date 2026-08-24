import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import PartnerPortalShell from '@/components/partners/portal/PartnerPortalShell';
import PortalStudioContent from '@/components/partners/portal/PortalStudioContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kendi uygulamanı yap | Geliştirici paneli',
  description: 'Tarayıcı tabanlı geliştirme ortamı ile kendi uygulamanızı oluşturun.',
  path: '/partners/studio',
  noIndex: true,
});

export default function PartnersStudioPage() {
  return (
    <DemoGate fallbackHref="/login">
      <PartnerPortalShell title="Kendi uygulamanı yap">
        <PortalStudioContent />
      </PartnerPortalShell>
    </DemoGate>
  );
}
