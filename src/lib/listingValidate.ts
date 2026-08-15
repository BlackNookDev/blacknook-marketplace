import {
  LISTING_STEPS,
  type ListingDraft,
  type ListingStepId,
} from '@/lib/listingDraft';

export const DELIVERY_OPTIONS = [
  { id: 'self-host', label: 'Kendi sunucunuzda' },
  { id: 'saas', label: 'Bizim sunucumuzda' },
  { id: 'both', label: 'İkisi de' },
] as const;

export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]['id'];

export function deliveryLabel(id: string | undefined) {
  return DELIVERY_OPTIONS.find((o) => o.id === id)?.label || '';
}

function looksLikeUrl(value: string) {
  return /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value.trim());
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function getStepErrors(step: ListingStepId, draft: ListingDraft): string[] {
  switch (step) {
    case 'basic': {
      const errors: string[] = [];
      if (draft.productName.trim().length < 2) errors.push('Ürün adı yazın.');
      if (!draft.category.trim()) errors.push('Kategori seçin.');
      if (draft.tagline.trim().length < 2) errors.push('Kısa açıklama yazın.');
      if (draft.usp.trim().length < 8) errors.push('Ürünün ne yaptığını yazın.');
      if (!looksLikeUrl(draft.websiteUrl)) errors.push('Çalışan bir site adresi girin (https://…).');
      if (!DELIVERY_OPTIONS.some((o) => o.id === draft.delivery)) {
        errors.push('Ürünün nerede çalıştığını seçin.');
      }
      if (!looksLikeEmail(draft.supportEmail)) errors.push('Destek için bir e-posta girin.');
      if (draft.docsUrl.trim() && !looksLikeUrl(draft.docsUrl)) {
        errors.push('Dokümantasyon adresi https:// ile başlamalı.');
      }
      return errors;
    }
    case 'media': {
      const errors: string[] = [];
      if (!draft.companyIconData.trim()) errors.push('Ürün ikonu yükleyin.');
      if (!draft.heroImageData.trim()) errors.push('Kapak görseli yükleyin.');
      if (!(draft.screenshotData || []).some((s) => s.trim())) {
        errors.push('En az bir ekran görüntüsü yükleyin.');
      }
      return errors;
    }
    case 'features': {
      const ready = (draft.stories || []).some(
        (s) => s.title.trim() && s.bullets.some((b) => b.trim())
      );
      return ready ? [] : ['En az bir özellik ve bir madde yazın.'];
    }
    case 'pricing': {
      const ready = (draft.tiers || []).some((t) => t.name.trim() && Number(t.price) > 0);
      return ready ? [] : ['En az bir plan adı ve fiyatı (USD) girin.'];
    }
    case 'story': {
      const errors: string[] = [];
      if (draft.founderNarrative.trim().length < 40) errors.push('Kısa bir ürün hikâyesi yazın.');
      if (draft.founderName.trim().length < 2) errors.push('Adınızı yazın.');
      return errors;
    }
    case 'faq': {
      return (draft.faqs || [])
        .filter((f) => f.question.trim() && !f.answer.trim())
        .map((_, i) => `Soru ${i + 1} için yanıt yazın.`);
    }
    case 'review':
      return [];
    default:
      return [];
  }
}

export function firstIncompleteStep(draft: ListingDraft): ListingStepId | null {
  for (const step of LISTING_STEPS) {
    if (step.id === 'review') continue;
    if (getStepErrors(step.id, draft).length) return step.id;
  }
  return null;
}

export function isListingReady(draft: ListingDraft) {
  return firstIncompleteStep(draft) === null;
}
