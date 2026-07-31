import Image from 'next/image';
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
      className={cn(
        'inline-flex items-center gap-2 transition-opacity duration-premium ease-premium hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70',
        className
      )}
    >
      <Image
        src="/bn-mark.svg"
        alt=""
        width={28}
        height={28}
        className={cn('h-7 w-7 shrink-0 object-contain brightness-0 invert', iconClassName)}
        priority
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
