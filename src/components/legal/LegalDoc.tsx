import type { ReactNode } from 'react';

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalDoc({ title, updated, children }: Props) {
  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]"
      />
      <article className="relative mx-auto max-w-3xl">
        <header className="mb-10 border-b border-white/[0.08] pb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Son güncelleme: {updated}</p>
        </header>
        <div className="legal-prose space-y-6 text-sm leading-relaxed text-zinc-400 [&_a]:text-zinc-200 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-white [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:text-zinc-400 [&_strong]:font-semibold [&_strong]:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </main>
  );
}
