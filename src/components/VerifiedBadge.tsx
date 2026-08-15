import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  compact?: boolean;
};

export default function VerifiedBadge({ className, compact = false }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium text-sky-300',
        compact ? 'text-[11px]' : 'text-sm',
        className
      )}
    >
      <BadgeCheck
        className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}
        aria-hidden
      />
      {compact ? 'Doğrulanmış' : 'Doğrulanmış'}
    </span>
  );
}
