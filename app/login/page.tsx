import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Log in — BlackNOOK',
  description: 'BlackNOOK hesabınıza giriş yapın.',
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center justify-center px-6 pb-20 pt-28">
      <LoginForm />
    </div>
  );
}
