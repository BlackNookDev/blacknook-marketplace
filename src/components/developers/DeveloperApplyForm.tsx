'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';
import { cn } from '@/lib/utils';
import type { ApplicantType } from '@/lib/developerApplicationsTypes';

const field =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-white/25';
const selectField = `${field} appearance-none`;

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-zinc-400">
      {children}
      {required ? ' *' : ''}
    </label>
  );
}

export default function DeveloperApplyForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applicantType, setApplicantType] = useState<ApplicantType>('developer');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [about, setAbout] = useState('');
  // developer
  const [yearsExperience, setYearsExperience] = useState('');
  const [primaryRole, setPrimaryRole] = useState('fullstack');
  const [languages, setLanguages] = useState('');
  const [openSource, setOpenSource] = useState('');
  const [notableProjects, setNotableProjects] = useState('');
  const [productToList, setProductToList] = useState('');
  const [deliveryModel, setDeliveryModel] = useState('self-host');
  const [demoUrl, setDemoUrl] = useState('');
  const [supportHours, setSupportHours] = useState('');
  const [englishLevel, setEnglishLevel] = useState('B2');
  const [pricingIdea, setPricingIdea] = useState('');
  const [whyBlacknook, setWhyBlacknook] = useState('');
  // entrepreneur
  const [founderRole, setFounderRole] = useState('founder');
  const [productName, setProductName] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [stage, setStage] = useState('mvp');
  const [revenueStatus, setRevenueStatus] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [traction, setTraction] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [goToMarket, setGoToMarket] = useState('');
  const [funding, setFunding] = useState('');
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [launchTimeline, setLaunchTimeline] = useState('');
  const [supportPlan, setSupportPlan] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setFullName(session?.user?.name || '');
  }, [session?.user?.name]);

  useEffect(() => {
    let cancelled = false;
    void apiFetch('/api/developer-applications', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.canAccessPortal) {
          router.replace('/partners/overview');
          return;
        }
        if (data?.application?.status === 'pending') {
          router.replace('/developers/status');
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const answers: Record<string, string> =
      applicantType === 'developer'
        ? {
            city,
            yearsExperience,
            primaryRole,
            languages,
            linkedinUrl,
            openSource,
            notableProjects,
            productToList,
            deliveryModel,
            demoUrl,
            supportHours,
            englishLevel,
            pricingIdea,
            whyBlacknook,
          }
        : {
            city,
            founderRole,
            linkedinUrl,
            productName,
            oneLiner,
            problem,
            solution,
            targetCustomer,
            stage,
            revenueStatus,
            teamSize,
            traction,
            competitors,
            goToMarket,
            funding,
            pitchDeckUrl,
            launchTimeline,
            supportPlan,
            productToList,
            deliveryModel,
            demoUrl,
            whyBlacknook,
          };

    try {
      const res = await apiFetch('/api/developer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantType,
          fullName,
          companyName,
          websiteUrl,
          githubUrl,
          portfolioUrl,
          skills: applicantType === 'developer' ? skills : languages || skills,
          about,
          answers,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Başvuru gönderilemedi.');
        setLoading(false);
        return;
      }
      router.push('/developers/status');
    } catch {
      setError('Bağlantı hatası.');
      setLoading(false);
    }
  };

  if (checking) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <p className="mb-3 text-sm text-zinc-400">Başvuru tipi *</p>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 p-1.5">
          {(
            [
              { id: 'developer' as const, label: 'Yazılımcı' },
              { id: 'entrepreneur' as const, label: 'Girişimci' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setApplicantType(opt.id)}
              className={cn(
                'rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition',
                applicantType === opt.id
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="font-display text-lg font-semibold text-white">Kimlik</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label required>Ad soyad</Label>
            <input
              className={field}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={255}
            />
          </div>
          <div>
            <Label required={applicantType === 'entrepreneur'}>
              {applicantType === 'entrepreneur' ? 'Şirket / girişim adı' : 'Şirket / marka'}
            </Label>
            <input
              className={field}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required={applicantType === 'entrepreneur'}
              maxLength={255}
              placeholder={applicantType === 'entrepreneur' ? 'Zorunlu' : 'Opsiyonel'}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Şehir / ülke</Label>
            <input
              className={field}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="örn. İstanbul, TR"
              maxLength={120}
            />
          </div>
          {applicantType === 'entrepreneur' ? (
            <div>
              <Label required>Kurucu rolünüz</Label>
              <select
                className={selectField}
                value={founderRole}
                onChange={(e) => setFounderRole(e.target.value)}
                required
              >
                <option value="founder">Kurucu (Founder)</option>
                <option value="cofounder">Ortak kurucu</option>
                <option value="ceo">CEO / yönetici</option>
                <option value="product">Ürün / büyüme sorumlusu</option>
                <option value="other">Diğer</option>
              </select>
            </div>
          ) : (
            <div>
              <Label>LinkedIn</Label>
              <input
                className={field}
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/…"
              />
            </div>
          )}
        </div>
        {applicantType === 'entrepreneur' ? (
          <div>
            <Label>LinkedIn</Label>
            <input
              className={field}
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </div>
        ) : null}
      </section>

      {applicantType === 'developer' ? (
        <>
          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Teknik profil</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>Deneyim (yıl)</Label>
                <input
                  className={field}
                  type="number"
                  min={0}
                  max={50}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  required
                  placeholder="örn. 5"
                />
              </div>
              <div>
                <Label required>Birincil rol</Label>
                <select
                  className={selectField}
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value)}
                  required
                >
                  <option value="fullstack">Full-stack</option>
                  <option value="backend">Backend</option>
                  <option value="frontend">Frontend</option>
                  <option value="devops">DevOps / Platform</option>
                  <option value="mobile">Mobile</option>
                  <option value="ml">ML / AI</option>
                  <option value="security">Güvenlik</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>
            <div>
              <Label required>
                Ana yığın / beceriler
              </Label>
              <input
                className={field}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                placeholder="örn. Next.js, Postgres, Docker, TypeScript"
                maxLength={1000}
              />
            </div>
            <div>
              <Label>Programlama dilleri</Label>
              <input
                className={field}
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="örn. TypeScript, Go, Python"
                maxLength={500}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>İngilizce seviyesi</Label>
                <select
                  className={selectField}
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value)}
                  required
                >
                  <option value="A2">A2 — Temel</option>
                  <option value="B1">B1 — Orta altı</option>
                  <option value="B2">B2 — Orta</option>
                  <option value="C1">C1 — İleri</option>
                  <option value="C2">C2 — Ana dil düzeyinde</option>
                </select>
              </div>
              <div>
                <Label required>Haftalık destek kapasitesi</Label>
                <select
                  className={selectField}
                  value={supportHours}
                  onChange={(e) => setSupportHours(e.target.value)}
                  required
                >
                  <option value="">Seçin</option>
                  <option value="1-3">1–3 saat</option>
                  <option value="4-8">4–8 saat</option>
                  <option value="9-16">9–16 saat</option>
                  <option value="17+">17+ saat</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Kanıt & portföy</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>GitHub</Label>
                <input
                  className={field}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                  placeholder="https://github.com/…"
                />
              </div>
              <div>
                <Label>Portföy / site</Label>
                <input
                  className={field}
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <input
                className={field}
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://"
              />
            </div>
            <div>
              <Label required>
                Öne çıkan projeler
              </Label>
              <textarea
                className={`${field} min-h-[100px] resize-y`}
                value={notableProjects}
                onChange={(e) => setNotableProjects(e.target.value)}
                required
                minLength={40}
                maxLength={3000}
                placeholder="Proje, rol, link…"
              />
            </div>
            <div>
              <Label>Açık kaynak katkıları</Label>
              <textarea
                className={`${field} min-h-[72px] resize-y`}
                value={openSource}
                onChange={(e) => setOpenSource(e.target.value)}
                maxLength={2000}
                placeholder="Opsiyonel"
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Blacknook’ta listeleme</h2>
            <div>
              <Label required>Ne listelemek istiyorsunuz?</Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={productToList}
                onChange={(e) => setProductToList(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
                placeholder="Ürün ve kategori…"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>Teslimat modeli</Label>
                <select
                  className={selectField}
                  value={deliveryModel}
                  onChange={(e) => setDeliveryModel(e.target.value)}
                  required
                >
                  <option value="self-host">Self-host / kendi sunucu</option>
                  <option value="saas">SaaS (bizim veya sizin barındırma)</option>
                  <option value="both">İkisi de</option>
                  <option value="script">Script / kütüphane</option>
                </select>
              </div>
              <div>
                <Label>Demo / canlı URL</Label>
                <input
                  className={field}
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
            <div>
              <Label>Fiyatlandırma fikri</Label>
              <input
                className={field}
                value={pricingIdea}
                onChange={(e) => setPricingIdea(e.target.value)}
                placeholder="örn. lifetime $79 / aylık $12"
                maxLength={500}
              />
            </div>
            <div>
              <Label required>Neden Blacknook?</Label>
              <textarea
                className={`${field} min-h-[80px] resize-y`}
                value={whyBlacknook}
                onChange={(e) => setWhyBlacknook(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
              />
            </div>
            <div>
              <Label required>Kendinizi ve yaklaşımınızı anlatın</Label>
              <textarea
                className={`${field} min-h-[120px] resize-y`}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
                minLength={60}
                maxLength={4000}
                placeholder="Kısa özet…"
              />
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Ürün & pazar</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>Ürün adı</Label>
                <input
                  className={field}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <Label required>Aşama</Label>
                <select
                  className={selectField}
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  required
                >
                  <option value="idea">Fikir</option>
                  <option value="mvp">MVP</option>
                  <option value="beta">Kapalı / açık beta</option>
                  <option value="launched">Yayında (gelir yok veya az)</option>
                  <option value="revenue">Düzenli gelir var</option>
                </select>
              </div>
            </div>
            <div>
              <Label required>Tek cümlelik vaat (one-liner)</Label>
              <input
                className={field}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                required
                maxLength={200}
                placeholder="Kim için, ne işe yarıyor?"
              />
            </div>
            <div>
              <Label required>Hangi problemi çözüyorsunuz?</Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
                minLength={30}
                maxLength={2500}
              />
            </div>
            <div>
              <Label required>Çözümünüz nedir?</Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
                minLength={30}
                maxLength={2500}
              />
            </div>
            <div>
              <Label required>Hedef müşteri</Label>
              <textarea
                className={`${field} min-h-[72px] resize-y`}
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                required
                minLength={20}
                maxLength={1500}
                placeholder="Hedef kitle…"
              />
            </div>
            <div>
              <Label>Rakipler ve farkınız</Label>
              <textarea
                className={`${field} min-h-[72px] resize-y`}
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                maxLength={2000}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Traction & ekip</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>Ekip büyüklüğü</Label>
                <select
                  className={selectField}
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  required
                >
                  <option value="">Seçin</option>
                  <option value="1">Tek kişi</option>
                  <option value="2-3">2–3</option>
                  <option value="4-10">4–10</option>
                  <option value="11+">11+</option>
                </select>
              </div>
              <div>
                <Label required>Gelir durumu</Label>
                <select
                  className={selectField}
                  value={revenueStatus}
                  onChange={(e) => setRevenueStatus(e.target.value)}
                  required
                >
                  <option value="">Seçin</option>
                  <option value="pre-revenue">Henüz gelir yok</option>
                  <option value="pilots">Pilotilot / ücretli deneme</option>
                  <option value="mrr-low">MRR &lt; $1k</option>
                  <option value="mrr-mid">MRR $1k–$10k</option>
                  <option value="mrr-high">MRR $10k+</option>
                </select>
              </div>
            </div>
            <div>
              <Label required>
                Traction / metrikler
              </Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={traction}
                onChange={(e) => setTraction(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
              />
            </div>
            <div>
              <Label required>Go-to-market planı</Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={goToMarket}
                onChange={(e) => setGoToMarket(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
                placeholder="Kısa plan…"
              />
            </div>
            <div>
              <Label>Yatırım / fonlama</Label>
              <textarea
                className={`${field} min-h-[64px] resize-y`}
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                maxLength={1500}
                placeholder="Opsiyonel"
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">Blacknook & materyaller</h2>
            <div>
              <Label required>Blacknook’ta ne listelemek / sunmak istiyorsunuz?</Label>
              <textarea
                className={`${field} min-h-[88px] resize-y`}
                value={productToList}
                onChange={(e) => setProductToList(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>Teslimat modeli</Label>
                <select
                  className={selectField}
                  value={deliveryModel}
                  onChange={(e) => setDeliveryModel(e.target.value)}
                  required
                >
                  <option value="saas">SaaS</option>
                  <option value="self-host">Self-host</option>
                  <option value="both">İkisi de</option>
                  <option value="marketplace">Pazaryeri / hizmet</option>
                </select>
              </div>
              <div>
                <Label required>Hedef lansman zamanı</Label>
                <select
                  className={selectField}
                  value={launchTimeline}
                  onChange={(e) => setLaunchTimeline(e.target.value)}
                  required
                >
                  <option value="">Seçin</option>
                  <option value="ready">Hemen hazır</option>
                  <option value="30d">30 gün içinde</option>
                  <option value="90d">90 gün içinde</option>
                  <option value="later">Daha sonra</option>
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Website</Label>
                <input
                  className={field}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div>
                <Label>Demo / ürün URL</Label>
                <input
                  className={field}
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Pitch deck URL</Label>
                <input
                  className={field}
                  value={pitchDeckUrl}
                  onChange={(e) => setPitchDeckUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div>
                <Label>Portföy / GitHub</Label>
                <input
                  className={field}
                  value={githubUrl || portfolioUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setPortfolioUrl(e.target.value);
                  }}
                  placeholder="https://"
                />
              </div>
            </div>
            <div>
              <Label required>Müşteri destek planı</Label>
              <textarea
                className={`${field} min-h-[72px] resize-y`}
                value={supportPlan}
                onChange={(e) => setSupportPlan(e.target.value)}
                required
                minLength={15}
                maxLength={1500}
                placeholder="Kanal ve SLA…"
              />
            </div>
            <div>
              <Label required>Neden Blacknook?</Label>
              <textarea
                className={`${field} min-h-[80px] resize-y`}
                value={whyBlacknook}
                onChange={(e) => setWhyBlacknook(e.target.value)}
                required
                minLength={20}
                maxLength={2000}
              />
            </div>
            <div>
              <Label required>Kurucu hikâyesi / vizyon</Label>
              <textarea
                className={`${field} min-h-[120px] resize-y`}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
                minLength={60}
                maxLength={4000}
                placeholder="Kısa vizyon…"
              />
            </div>
          </section>
        </>
      )}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor…' : 'Başvuruyu gönder'}
        </button>
        <Link href="/sell" className="text-sm text-zinc-500 hover:text-zinc-300">
          Program
        </Link>
      </div>
    </form>
  );
}
