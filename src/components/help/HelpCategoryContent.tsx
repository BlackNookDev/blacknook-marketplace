import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getHelpCategory } from '../../../lib/helpCenter';
import { notFound } from 'next/navigation';

type Props = { slug: string };

export default function HelpCategoryContent({ slug }: Props) {
  const category = getHelpCategory(slug);
  if (!category) notFound();

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Yardım merkezi
        </Link>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{category.description}</p>

        <ul className="mt-10 space-y-4">
          {category.articles.map((article) => (
            <li
              key={article.id}
              id={article.id}
              className="scroll-mt-28 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-5"
            >
              <h2 className="font-display text-base font-semibold text-white">{article.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{article.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-zinc-500">
          Yanıt bulamadınız mı?{' '}
          <a href="mailto:contact@blacknook.com" className="text-zinc-300 underline underline-offset-2">
            contact@blacknook.com
          </a>
        </p>
      </div>
    </main>
  );
}
