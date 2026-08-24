import { redirect } from 'next/navigation';

/** Affiliate menüden kaldırıldı — eski URL’ler profile yönlendirilir */
export default function AccountAffiliatePage() {
  redirect('/account');
}
