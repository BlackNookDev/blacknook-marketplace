export const ACCOUNT_NAV = [
  { href: '/account', label: 'Profil', icon: 'user' as const },
  { href: '/account/messages', label: 'Mesajlar', icon: 'inbox' as const },
  { href: '/account/requests', label: 'Talepler', icon: 'requests' as const },
  { href: '/account/products', label: 'Ürünler', icon: 'grid' as const },
  { href: '/account/billing', label: 'Ödeme & faturalama', icon: 'card' as const },
  { href: '/account/credits', label: 'Kredi & hediye kartları', icon: 'coins' as const },
  { href: '/account/rewards', label: 'Ödüller', icon: 'gift' as const },
  { href: '/account/membership', label: 'Plus üyelik', icon: 'plus' as const },
  { href: '/account/affiliate', label: 'Affiliate programı', icon: 'users' as const },
] as const;

export type AccountNavIcon = (typeof ACCOUNT_NAV)[number]['icon'];
