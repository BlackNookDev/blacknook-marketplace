import { redirect } from 'next/navigation';

/** Kısa ürün formu kaldırıldı — tek yol: listing wizard */
export default function VendorNewProductRedirect() {
  redirect('/partners/self-submission');
}
