'use client';

import { useId, useState, type ReactNode } from 'react';

export function HintMark({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 text-[10px] font-semibold leading-none text-zinc-400 hover:border-white/40 hover:text-zinc-200"
        aria-label="Açıklama"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        title={text}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-6 z-30 w-56 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-left text-xs font-normal leading-relaxed text-zinc-300 shadow-xl"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}

export function FieldLabel({
  htmlFor,
  required,
  hint,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  const inner = (
    <>
      <span>{children}</span>
      {required ? <span className="text-zinc-500">*</span> : null}
      {hint ? <HintMark text={hint} /> : null}
    </>
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-300">
        {inner}
      </label>
    );
  }

  return <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-300">{inner}</p>;
}
