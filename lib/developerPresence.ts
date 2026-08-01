/** Ambient “aktif geliştirici” sinyalleri — mock, deterministik aralık */

export type DevPresence = {
  id: string;
  initials: string;
  /** Tailwind-ish bg color */
  color: string;
  role: string;
};

export const DEVELOPERS: DevPresence[] = [
  { id: 'd1', initials: 'AY', color: '#34d399', role: 'Full-stack' },
  { id: 'd2', initials: 'MK', color: '#22d3ee', role: 'DevOps' },
  { id: 'd3', initials: 'EL', color: '#a3e635', role: 'Backend' },
  { id: 'd4', initials: 'SR', color: '#fbbf24', role: 'SaaS' },
  { id: 'd5', initials: 'TN', color: '#60a5fa', role: 'AI' },
  { id: 'd6', initials: 'ZB', color: '#f472b6', role: 'Frontend' },
  { id: 'd7', initials: 'HK', color: '#c084fc', role: 'Auth' },
  { id: 'd8', initials: 'DC', color: '#2dd4bf', role: 'Infra' },
];

export type ActivityItem = {
  id: string;
  name: string;
  action: string;
  minsAgo: number;
};

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: 'a1', name: 'Ayşe', action: 'Supabase kurulumuna yanıt verdi', minsAgo: 2 },
  { id: 'a2', name: 'Mert', action: 'Next.js deploy eşleşmesi', minsAgo: 4 },
  { id: 'a3', name: 'Elif', action: 'Auth + billing talebini aldı', minsAgo: 7 },
  { id: 'a4', name: 'Sara', action: 'n8n otomasyonuna atandı', minsAgo: 11 },
  { id: 'a5', name: 'Tan', action: 'AI agent kurulumu', minsAgo: 14 },
  { id: 'a6', name: 'Zey', action: 'Ghost CMS entegrasyonu', minsAgo: 18 },
];

/** Saat bazlı yavaş salınan “aktif” sayısı (2–8 arası) */
export function getActiveDeveloperCount(now = Date.now()): number {
  const minute = Math.floor(now / 60_000);
  const wave = Math.sin(minute / 7) * 2.2 + Math.cos(minute / 11) * 1.2;
  return Math.max(2, Math.min(8, Math.round(5 + wave)));
}

export function getRecentActivity(now = Date.now()): ActivityItem {
  const idx = Math.floor(now / 45_000) % ACTIVITY_FEED.length;
  return ACTIVITY_FEED[idx];
}

export function formatMinsAgo(mins: number): string {
  if (mins <= 1) return 'az önce';
  return `${mins} dk önce`;
}
