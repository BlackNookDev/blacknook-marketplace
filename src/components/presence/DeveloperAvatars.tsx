'use client';

export type AvatarPerson = {
  id: string;
  initials: string;
  color: string;
  role?: string;
};

type Props = {
  people?: AvatarPerson[];
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
};

const SIZE = {
  sm: 'h-6 w-6 text-[9px]',
  md: 'h-9 w-9 text-[11px]',
} as const;

export default function DeveloperAvatars({
  people = [],
  count,
  size = 'sm',
  className = '',
}: Props) {
  const list = people.slice(0, count ?? people.length);
  if (!list.length) return null;

  return (
    <ul className={`flex items-center ${className}`} aria-hidden>
      {list.map((dev, i) => (
        <li
          key={dev.id}
          className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--bn-bg,#050505)] font-semibold text-black ${SIZE[size]} ${
            i > 0 ? '-ml-2' : ''
          }`}
          style={{ backgroundColor: dev.color, zIndex: list.length - i }}
          title={dev.role}
        >
          {dev.initials}
        </li>
      ))}
    </ul>
  );
}
