import { redirect } from 'next/navigation';

/** Eski başvuru formu — tek satıcı yolu: /sell → listing */
export default function DevelopersApplyRedirect() {
  redirect('/partners/self-submission');
}
