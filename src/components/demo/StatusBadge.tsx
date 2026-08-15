type Props = {
  status: 'pending' | 'approved' | 'rejected' | string;
};

const LABELS: Record<string, string> = {
  pending: 'İncelemede',
  approved: 'Yayında',
  rejected: 'Reddedildi',
  unpublished: 'Yayından alındı',
};

const STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300',
  approved: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-rose-500/15 text-rose-300',
  unpublished: 'bg-zinc-500/20 text-zinc-300',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STYLES[status] ?? 'bg-white/10 text-zinc-300'}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
