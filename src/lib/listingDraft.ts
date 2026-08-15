/** Partner ürün taslağı — hesap üzerinden veritabanında saklanır. */

export type PricingModel = 'licensing' | 'codes';

export type ListingType = 'saas' | 'micro-saas';

export const LISTING_TYPES = [
  { id: 'saas', label: 'SaaS' },
  { id: 'micro-saas', label: 'MicroSaaS' },
] as const;

export type ListingTier = {
  id: string;
  name: string;
  price: number;
  recommended: boolean;
};

export type FeatureMatrixRow = {
  id: string;
  label: string;
  values: string[];
  inAllPlans: boolean;
};

export type FeatureStory = {
  id: string;
  title: string;
  bullets: string[];
  screenshotNote: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  linkLabel: string;
  linkUrl: string;
};

export type ListingDraft = {
  productName: string;
  listingType: ListingType | '';
  category: string;
  tagline: string;
  secondaryTagline: string;
  usp: string;
  tldr: string[];
  alternativeTo: string;
  integrations: string;
  bestFor: string;
  companyIconNote: string;
  companyIconData: string;
  wordmarkNote: string;
  wordmarkData: string;
  heroImageNote: string;
  heroImageData: string;
  heroAlt: string;
  screenshotNotes: string[];
  screenshotData: string[];
  screenshotAlts: string[];
  featuresSectionHeader: string;
  stories: FeatureStory[];
  pricingModel: PricingModel;
  tiers: ListingTier[];
  matrix: FeatureMatrixRow[];
  maxCodes: number;
  storyHeadline: string;
  founderNarrative: string;
  founderName: string;
  founderRole: string;
  linkedinUrl: string;
  foundedYear: string;
  headquarters: string;
  teamSize: string;
  stage: string;
  funding: string;
  websiteUrl: string;
  docsUrl: string;
  supportEmail: string;
  delivery: string;
  catalogIcon?: string;
  g2Url: string;
  capterraUrl: string;
  stripeArrUrl: string;
  faqs: FaqItem[];
  updatedAt: string;
  submittedAt?: string;
};

export const LISTING_CATEGORIES = [
  'Proje yönetimi',
  'Geliştirici araçları',
  'Backend & Auth',
  'CMS',
  'Otomasyon',
  'AI',
  'Analitik',
  'E-ticaret',
  'Pazarlama',
  'Müşteri desteği',
  'Diğer',
] as const;

export const TEAM_SIZES = ['Solo', '1-10', '11-50', '51-200', '201-500', '500+'] as const;
export const STAGES = ['Indie', 'Startup', 'Growth', 'Established', 'Enterprise'] as const;
export const FUNDING = [
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Acquired',
] as const;

export const LISTING_STEPS = [
  { id: 'basic', label: 'Ürün' },
  { id: 'media', label: 'Görseller' },
  { id: 'features', label: 'Özellikler' },
  { id: 'pricing', label: 'Fiyat' },
  { id: 'story', label: 'Hikâye' },
  { id: 'faq', label: 'SSS' },
  { id: 'review', label: 'Gönder' },
] as const;

export type ListingStepId = (typeof LISTING_STEPS)[number]['id'];

const LEGACY_DRAFT_KEY = 'bn_listing_draft';

export function listingUid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function asStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item ?? ''));
}

function padTo(list: string[], length: number) {
  const next = [...list];
  while (next.length < length) next.push('');
  return next.slice(0, length);
}

export function listingTypeLabel(id: string | undefined) {
  if (id === 'service') return 'Servis';
  return LISTING_TYPES.find((item) => item.id === id)?.label || '';
}

export function normalizeListingType(value: unknown): ListingType | '' {
  if (value === 'saas' || value === 'micro-saas') return value;
  if (value === 'microSaas' || value === 'MicroSaaS' || value === 'microsaas') {
    return 'micro-saas';
  }
  return '';
}

export function emptyListingDraft(): ListingDraft {
  return {
    productName: '',
    listingType: '',
    category: LISTING_CATEGORIES[0],
    tagline: '',
    secondaryTagline: '',
    usp: '',
    tldr: [''],
    alternativeTo: '',
    integrations: '',
    bestFor: '',
    companyIconNote: '',
    companyIconData: '',
    wordmarkNote: '',
    wordmarkData: '',
    heroImageNote: '',
    heroImageData: '',
    heroAlt: '',
    screenshotNotes: [''],
    screenshotData: [''],
    screenshotAlts: [''],
    featuresSectionHeader: '',
    stories: [
      {
        id: listingUid('story'),
        title: '',
        bullets: [''],
        screenshotNote: '',
      },
    ],
    pricingModel: 'licensing',
    tiers: [{ id: listingUid('tier'), name: '', price: 0, recommended: true }],
    matrix: [],
    maxCodes: 5,
    storyHeadline: '',
    founderNarrative: '',
    founderName: '',
    founderRole: '',
    linkedinUrl: '',
    foundedYear: '',
    headquarters: '',
    teamSize: 'Solo',
    stage: 'Indie',
    funding: 'Bootstrapped',
    websiteUrl: '',
    docsUrl: '',
    supportEmail: '',
    delivery: '',
    g2Url: '',
    capterraUrl: '',
    stripeArrUrl: '',
    faqs: [],
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeListingDraft(parsed?: Partial<ListingDraft> | null): ListingDraft {
  const base = emptyListingDraft();
  if (!parsed || typeof parsed !== 'object') return base;

  const tldrRaw = asStringList(parsed.tldr, base.tldr).slice(0, 6);
  const screenshotData = asStringList(parsed.screenshotData, ['']).slice(0, 8);
  const shotCount = Math.max(screenshotData.length, 1);
  const screenshotAlts = padTo(asStringList(parsed.screenshotAlts, ['']), shotCount).slice(0, 8);
  const screenshotNotes = padTo(asStringList(parsed.screenshotNotes, ['']), shotCount).slice(0, 8);

  const stories =
    Array.isArray(parsed.stories) && parsed.stories.length
      ? parsed.stories.slice(0, 6).map((story) => ({
          id: String(story?.id || listingUid('story')),
          title: String(story?.title ?? ''),
          bullets:
            Array.isArray(story?.bullets) && story.bullets.length
              ? story.bullets.map((b) => String(b ?? '')).slice(0, 8)
              : [''],
          screenshotNote: String(story?.screenshotNote ?? ''),
        }))
      : base.stories;

  const tiers =
    Array.isArray(parsed.tiers) && parsed.tiers.length
      ? parsed.tiers.slice(0, 5).map((tier) => ({
          id: String(tier?.id || listingUid('tier')),
          name: String(tier?.name ?? ''),
          price: Number(tier?.price) || 0,
          recommended: Boolean(tier?.recommended),
        }))
      : base.tiers;

  const matrix =
    Array.isArray(parsed.matrix) && parsed.matrix.length
      ? parsed.matrix.slice(0, 20).map((row) => ({
          id: String(row?.id || listingUid('row')),
          label: String(row?.label ?? ''),
          values: padTo(asStringList(row?.values, []), tiers.length),
          inAllPlans: Boolean(row?.inAllPlans),
        }))
      : base.matrix.map((row) => ({ ...row, values: padTo(row.values, tiers.length) }));

  const faqs = Array.isArray(parsed.faqs)
    ? parsed.faqs.slice(0, 12).map((faq) => ({
        id: String(faq?.id || listingUid('faq')),
        question: String(faq?.question ?? ''),
        answer: String(faq?.answer ?? ''),
        linkLabel: String(faq?.linkLabel ?? ''),
        linkUrl: String(faq?.linkUrl ?? ''),
      }))
    : base.faqs;

  return {
    ...base,
    ...parsed,
    tldr: tldrRaw.length ? tldrRaw : [''],
    screenshotData: padTo(screenshotData, shotCount),
    screenshotAlts,
    screenshotNotes,
    stories,
    tiers,
    matrix,
    faqs,
    listingType: normalizeListingType(parsed.listingType),
    docsUrl: String(parsed.docsUrl ?? base.docsUrl),
    supportEmail: String(parsed.supportEmail ?? base.supportEmail),
    delivery: String(parsed.delivery ?? base.delivery),
    maxCodes: Math.min(20, Math.max(1, Number(parsed.maxCodes) || base.maxCodes)),
    pricingModel: parsed.pricingModel === 'codes' ? 'codes' : 'licensing',
    updatedAt: parsed.updatedAt || base.updatedAt,
  };
}

/** Eski tarayıcı taslağını siler; yeni kayıtlar yalnızca veritabanındadır. */
export function discardBrowserListingDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(LEGACY_DRAFT_KEY);
  } catch {
    /* yok say */
  }
}

export function charHint(current: number, max: number) {
  return `${current}/${max}`;
}
