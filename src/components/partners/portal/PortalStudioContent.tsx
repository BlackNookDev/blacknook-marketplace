'use client';

import DeveloperWorkspace from '@/components/developers/DeveloperWorkspace';

export default function PortalStudioContent() {
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
        Tarayıcıda izole Coder v2 ortamı. Her geliştirici kendi konteynerinde kod yazar; başlatıp
        durdurabilirsiniz.
      </p>
      <DeveloperWorkspace projectName="default" />
    </div>
  );
}
