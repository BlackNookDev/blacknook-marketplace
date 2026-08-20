import { cn } from '@/lib/utils';

const PAYTR_URL = 'https://www.paytr.com';

type Props = {
  className?: string;
  /** white: koyu zemin; color: açık zemin */
  variant?: 'white' | 'color';
  /** logo yüksekliği */
  heightClass?: string;
};

export default function PaytrLogo({
  className,
  variant = 'white',
  heightClass = 'h-5',
}: Props) {
  const src =
    variant === 'color' ? '/paytr/paytr-logo-color.svg' : '/paytr/paytr-logo-white.svg';

  return (
    <a
      href={PAYTR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center opacity-80 transition-opacity hover:opacity-100',
        className
      )}
      aria-label="PayTR ile güvenli ödeme (yeni sekmede açılır)"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="PayTR"
        className={cn(heightClass, 'w-auto')}
        width={180}
        height={30}
      />
    </a>
  );
}

/** Footer ve ödeme ekranları için kısa güven satırı */
export function PaytrTrustRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <p className="text-[11px] text-zinc-500">Güvenli ödeme</p>
      <PaytrLogo heightClass="h-4 sm:h-[18px]" />
    </div>
  );
}
