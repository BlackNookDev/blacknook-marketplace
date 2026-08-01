import { redirect } from 'next/navigation';

/** Eski partner paneli → yeni portal kontrol paneli */
export default function VendorRedirectPage() {
  redirect('/partners/overview');
}
