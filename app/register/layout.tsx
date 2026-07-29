import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kayıt ol — BlackNOOK',
  description: 'BlackNOOK hesabı oluşturun.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
