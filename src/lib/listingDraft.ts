/** Partner ürün taslağı — localStorage demo */

export const LISTING_EVENT = 'bn-listing-change';
const DRAFT_KEY = 'bn_listing_draft';

export type PricingModel = 'licensing' | 'codes';

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
  category: string;
  tagline: string;
  secondaryTagline: string;
  usp: string;
  tldr: [string, string];
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
  { id: 'basic', label: 'Temel bilgiler' },
  { id: 'media', label: 'Medya' },
  { id: 'features', label: 'Öne çıkan özellikler' },
  { id: 'pricing', label: 'Fiyatlandırma' },
  { id: 'story', label: 'Ürün hikayesi' },
  { id: 'trust', label: 'Güven sinyalleri' },
  { id: 'faq', label: 'SSS' },
  { id: 'review', label: 'Gözden geçir' },
] as const;

export type ListingStepId = (typeof LISTING_STEPS)[number]['id'];

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyListingDraft(): ListingDraft {
  return {
    productName: '',
    category: LISTING_CATEGORIES[0],
    tagline: '',
    secondaryTagline: '',
    usp: '',
    tldr: ['', ''],
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
    screenshotNotes: ['', '', '', ''],
    screenshotData: ['', '', '', ''],
    screenshotAlts: ['', '', '', ''],
    featuresSectionHeader: '',
    stories: [
      {
        id: uid('story'),
        title: '',
        bullets: ['', ''],
        screenshotNote: '',
      },
      {
        id: uid('story'),
        title: '',
        bullets: ['', ''],
        screenshotNote: '',
      },
    ],
    pricingModel: 'licensing',
    tiers: [
      { id: uid('tier'), name: 'Solo', price: 49, recommended: false },
      { id: uid('tier'), name: 'Pro', price: 99, recommended: true },
    ],
    matrix: [
      {
        id: uid('row'),
        label: 'Kullanıcı sayısı',
        values: ['1', '5'],
        inAllPlans: false,
      },
      {
        id: uid('row'),
        label: 'Projeler',
        values: ['3', 'Sınırsız'],
        inAllPlans: false,
      },
    ],
    maxCodes: 5,
    storyHeadline: '',
    founderNarrative: '',
    founderName: '',
    founderRole: 'Kurucu',
    linkedinUrl: '',
    foundedYear: '',
    headquarters: '',
    teamSize: 'Solo',
    stage: 'Indie',
    funding: 'Bootstrapped',
    websiteUrl: '',
    g2Url: '',
    capterraUrl: '',
    stripeArrUrl: '',
    faqs: [
      { id: uid('faq'), question: '', answer: '', linkLabel: '', linkUrl: '' },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function getListingDraft(): ListingDraft {
  if (typeof window === 'undefined') return emptyListingDraft();
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyListingDraft();
    const parsed = JSON.parse(raw) as Partial<ListingDraft>;
    const base = emptyListingDraft();
    return {
      ...base,
      ...parsed,
      tldr: parsed.tldr ?? base.tldr,
      screenshotNotes: parsed.screenshotNotes?.length ? parsed.screenshotNotes : base.screenshotNotes,
      screenshotData: parsed.screenshotData?.length ? parsed.screenshotData : base.screenshotData,
      screenshotAlts: parsed.screenshotAlts?.length ? parsed.screenshotAlts : base.screenshotAlts,
      stories: parsed.stories?.length ? parsed.stories : base.stories,
      tiers: parsed.tiers?.length ? parsed.tiers : base.tiers,
      matrix: parsed.matrix?.length ? parsed.matrix : base.matrix,
      faqs: parsed.faqs?.length ? parsed.faqs : base.faqs,
      companyIconData: parsed.companyIconData ?? '',
      wordmarkData: parsed.wordmarkData ?? '',
      heroImageData: parsed.heroImageData ?? '',
    };
  } catch {
    return emptyListingDraft();
  }
}

export function saveListingDraft(draft: ListingDraft) {
  const next = { ...draft, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(LISTING_EVENT));
  return next;
}

export function clearListingDraft() {
  window.localStorage.removeItem(DRAFT_KEY);
  window.dispatchEvent(new Event(LISTING_EVENT));
}

export function charHint(current: number, max: number) {
  return `${current}/${max}`;
}
