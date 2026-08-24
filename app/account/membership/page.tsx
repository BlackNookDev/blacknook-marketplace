import { redirect } from 'next/navigation';

/** Plus üyelik menüden kaldırıldı — eski URL’ler profile yönlendirilir */
export default function AccountMembershipPage() {
  redirect('/account');
}
