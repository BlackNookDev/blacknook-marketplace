import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  compact?: boolean;
};

export default function VerifiedBadge({ className, compact = false }: Props) {
  return (
    <span
      className={cn('inline-flex items-center text-sky-300', className)}
      title="Doğrulanmış"
      aria-label="Doğrulanmış"
    >
      <BadgeCheck
        className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}
        aria-hidden
      />
    </span>
  );
}
