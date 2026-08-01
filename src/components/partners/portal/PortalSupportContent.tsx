'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { BookOpen, HelpCircle, Mail, MessageSquare } from 'lucide-react';

const FAQ = [
  {
    q: 'Ürünüm ne kadar sürede incelenir?',
    a: 'Eksiksiz başvurularda inceleme genellikle birkaç iş günü içinde tamamlanır. Eksik medya veya belirsiz fiyatlandırma süreci uzatabilir. Ayrıntılar için Yardım → Partner kaynakları.',
  },
  {
    q: 'Ödemeler ne zaman yapılır?',
    a: 'Canlı sistemde partner ödemeleri dönemsel olarak (ör. aylık) netleştirilir. Demo ortamında fatura satırları örnek veridir.',
  },
  {
    q: 'Select’e nasıl başvururum?',
    a: 'Blacknook Select özel lansman programıdır. /select sayfasından süreci inceleyip ürün formunu doldurun; ekip uygun ürünleri Select’e davet eder.',
  },
  {
    q: 'Listeyi güncelleyebilir miyim?',
    a: 'Yayındaki listelerde metin ve medya güncellemeleri yeniden incelemeye gidebilir. Reddedilen başvurularda notları okuyup formu yeniden gönderin.',
  },
];

export default function PortalSupportContent() {
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState('Ürün incelemesi');
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-zinc-500">
        Partner portalı desteği: sık sorulanlar, yardım merkezi ve doğrudan talep formu.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            href: '/help/partner',
            icon: BookOpen,
            title: 'Partner kaynakları',
            body: 'Başvuru, lansman, ödeme ve Portal rehberi',
          },
          {
            href: '/help',
            icon: HelpCircle,
            title: 'Yardım merkezi',
            body: 'Hesap, ödeme ve genel makaleler',
          },
          {
            href: '/select',
            icon: BookOpen,
            title: 'Blacknook Select',
            body: 'Özel lansman programı hakkında',
          },
          {
            href: 'mailto:contact@blacknook.com',
            icon: Mail,
            title: 'E-posta',
            body: 'contact@blacknook.com',
          },
        ].map(({ href, icon: Icon, title, body }) => (
          <Link
            key={title}
            href={href}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
          >
            <Icon className="h-5 w-5 text-zinc-400" aria-hidden />
            <p className="mt-3 font-medium text-zinc-100">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{body}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">Sık sorulanlar</h2>
        <dl className="mt-5 space-y-5">
          {FAQ.map((item) => (
            <div key={item.q} className="border-t border-white/[0.06] pt-5 first:border-t-0 first:pt-0">
              <dt className="text-sm font-semibold text-zinc-100">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-500">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-teal-300/90" aria-hidden />
          <h2 className="font-display text-lg font-semibold text-white">Destek talebi</h2>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Demo: form gönderimi yalnızca arayüzde onay gösterir; e-posta gönderilmez.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-5 text-sm text-emerald-100">
            Talebiniz alındı (demo). Gerçek ortamda destek ekibine düşer.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">Konu</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-white/25"
              >
                <option>Ürün incelemesi</option>
                <option>Ödeme / fatura</option>
                <option>Select başvurusu</option>
                <option>Teknik sorun</option>
                <option>Diğer</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">Mesaj</span>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ürün adınızı, sorunuzu ve varsa sipariş / başvuru kimliğini yazın…"
                className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/25"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              Gönder
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
