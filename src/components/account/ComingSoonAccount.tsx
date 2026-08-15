import AccountSection from '@/components/account/AccountSection';

type Props = {
  title: string;
  description: string;
  body?: string;
};

export default function ComingSoonAccount({ title, description, body }: Props) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <div className="mt-10">
        <AccountSection title="Henüz açık değil" description={description}>
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-8">
            <p className="text-sm leading-relaxed text-zinc-400">
              {body ||
                'Ödeme altyapısı yayına alınınca bu bölüm gerçek veriyle açılacak. Kart bilgisi toplanmaz; satın alma şu an mümkün değil.'}
            </p>
          </div>
        </AccountSection>
      </div>
    </div>
  );
}
