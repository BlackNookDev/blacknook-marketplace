'use client';

import { useRef } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

type Props = {
  label: string;
  help?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  aspectClass?: string;
  accept?: string;
};

const MAX_BYTES = 1.8 * 1024 * 1024;

export default function ImageUploadField({
  label,
  help,
  value,
  onChange,
  aspectClass = 'aspect-square',
  accept = 'image/png,image/jpeg,image/webp',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      window.alert('Görsel 1.8 MB altında olmalı (demo depolama limiti).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-300">{label}</p>
      {help ? <p className="mb-3 text-xs text-zinc-600">{help}</p> : null}

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`w-full object-cover ${aspectClass}`} />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/80 to-transparent p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-8 text-zinc-500 transition-colors hover:border-white/30 hover:bg-white/[0.04] hover:text-zinc-300 ${aspectClass}`}
        >
          <ImagePlus className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          <span className="text-sm font-medium">Görsel yükle</span>
          <span className="text-[11px] text-zinc-600">PNG, JPG veya WebP</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
