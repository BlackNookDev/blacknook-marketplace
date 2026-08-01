import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

/** BlackNOOK markası: ikon + wordmark */
export default function BrandLogo({ className, iconClassName, textClassName }: Props) {
  return (
    <Link
      href="/"
      aria-label="Blacknook ana sayfa"
      className={cn(
        'inline-flex items-center gap-2 transition-opacity duration-premium ease-premium hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70',
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bn-mark.svg"
        alt=""
        width={28}
        height={28}
        className={cn('h-7 w-7 shrink-0 object-contain', iconClassName)}
      />
      <span
        className={cn(
          'font-display text-[15px] font-bold tracking-tight text-white',
          textClassName
        )}
      >
        Blacknook
      </span>
    </Link>
  );
}
