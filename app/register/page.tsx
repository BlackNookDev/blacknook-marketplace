import { Suspense } from 'react';
import RegisterEarlyAccessForm from './RegisterEarlyAccessForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center justify-center px-6 pb-20 pt-28">
      <Suspense fallback={<div className="text-sm text-zinc-500">Yükleniyor…</div>}>
        <RegisterEarlyAccessForm />
      </Suspense>
    </div>
  );
}
