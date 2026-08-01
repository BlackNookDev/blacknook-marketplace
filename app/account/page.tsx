'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ExternalLink, Upload } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';
import { getDemoUser, type DemoUser } from '@/lib/demoAuth';

export default function AccountProfilePage() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const u = getDemoUser();
    setUser(u);
    if (u) {
      setEmail(u.email);
      setDisplayName(u.name);
    }
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Profil
      </h1>

      <div className="mt-10">
        <AccountSection
          title="Hesap ayarları"
          description="E-posta ve şifre ayarlarınızı güncelleyin."
        >
          <p className="mb-5 inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <EyeOff className="h-3.5 w-3.5" aria-hidden />
            E-posta ayarları yalnızca sizin tarafınızdan görülebilir.
          </p>

          {user?.email ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-zinc-200">{user.email}</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                Doğrulandı
              </span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                Birincil
              </span>
            </div>
          ) : null}

          <div className="space-y-5">
            <div>
              <label htmlFor="account-email" className="mb-2 block text-sm font-medium text-zinc-300">
                E-posta
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 sm:max-w-md"
                  placeholder="ornek@email.com"
                />
                <button
                  type="button"
                  className="h-11 shrink-0 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08]"
                >
                  E-posta ekle
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="account-phone" className="mb-2 block text-sm font-medium text-zinc-300">
                Telefon numarası
              </label>
              <div className="flex max-w-md gap-2">
                <span className="inline-flex h-11 items-center rounded-xl border border-white/15 px-3 text-sm text-zinc-400">
                  +90
                </span>
                <input
                  id="account-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
                  placeholder="5xx xxx xx xx"
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                Öne çıkan fırsatlar ve etkinlikler hakkında SMS almak istiyorum
              </label>
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] p-5">
              <h3 className="text-sm font-semibold text-zinc-100">Şifre sıfırlama gerekir mi?</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Size şifre sıfırlama bağlantısı içeren bir e-posta göndereceğiz.
              </p>
              <button
                type="button"
                className="mt-4 rounded-xl border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Şifreyi sıfırla
              </button>
            </div>
          </div>
        </AccountSection>

        <AccountSection
          title="Herkese açık profil"
          description="Blacknook Marketplace’te işletmenizi ve yetkinliklerinizi görünür kılın. İsterseniz daha sonra gizleyebilirsiniz."
          action={
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              Profili görüntüle
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
          }
        >
          <p className="mb-5 inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Herkese açık profil bilgileri Blacknook kullanıcıları tarafından görülebilir.
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="display-name" className="mb-2 block text-sm font-medium text-zinc-300">
                Görünen ad
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 w-full max-w-md rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              />
            </div>
            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-medium text-zinc-300">
                Kısa bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ne üzerinde çalışıyorsunuz?"
                className="w-full max-w-xl resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>
        </AccountSection>

        <AccountSection
          title="Kişisel bilgiler"
          description="Bu fotoğraf herkese açık profil sayfanızda görünecektir."
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/[0.03] text-sm font-semibold uppercase text-zinc-400">
              {displayName.slice(0, 2) || 'BN'}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Upload className="h-4 w-4" aria-hidden />
              Profil fotoğrafı yükle
            </button>
          </div>
        </AccountSection>
      </div>
    </div>
  );
}
