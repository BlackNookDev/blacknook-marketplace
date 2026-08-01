import type { Metadata } from 'next';
import HelpCategoryContent from '@/components/help/HelpCategoryContent';
import { HELP_CATEGORIES } from '../../../lib/helpCenter';
import { buildPageMetadata } from '@/lib/seo';

type Props = { params: { category: string } };

export function generateStaticParams() {
  return HELP_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = HELP_CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) {
    return buildPageMetadata({
      title: 'Yardım | Blacknook',
      description: 'Blacknook yardım merkezi',
      path: '/help',
    });
  }
  return buildPageMetadata({
    title: `${cat.title} | Yardım Merkezi`,
    description: cat.description,
    path: `/help/${cat.slug}`,
  });
}

export default function HelpCategoryPage({ params }: Props) {
  return <HelpCategoryContent slug={params.category} />;
}
