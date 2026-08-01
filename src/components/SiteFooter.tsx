'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { isPartnerPortalPath } from '@/lib/partnerPortal';

/** Partner portal sayfalarında ana site footer’ını gizler */
export default function SiteFooter() {
  const pathname = usePathname();
  if (isPartnerPortalPath(pathname)) return null;
  return <Footer />;
}
