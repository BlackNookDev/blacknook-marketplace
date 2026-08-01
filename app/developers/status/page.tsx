import { redirect } from 'next/navigation';

/** Eski durum URL’si — kanonik: /partners/status */
export default function DevelopersStatusRedirect() {
  redirect('/partners/status');
}
