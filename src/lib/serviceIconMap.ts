import type { IconType } from 'react-icons';
import {
  SiApachekafka,
  SiAppwrite,
  SiCaldotcom,
  SiChatwoot,
  SiClickhouse,
  SiCoolify,
  SiDirectus,
  SiElasticsearch,
  SiGhost,
  SiGitea,
  SiGitlab,
  SiGrafana,
  SiHasura,
  SiHoppscotch,
  SiKeycloak,
  SiListmonk,
  SiMattermost,
  SiMeilisearch,
  SiMetabase,
  SiMinio,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNginxproxymanager,
  SiNotion,
  SiOllama,
  SiOutline,
  SiPlausibleanalytics,
  SiPocketbase,
  SiPortainer,
  SiPostgresql,
  SiPosthog,
  SiPrometheus,
  SiRabbitmq,
  SiRedis,
  SiRocketdotchat,
  SiSentry,
  SiStrapi,
  SiSupabase,
  SiTraefikproxy,
  SiUmami,
  SiUptimekuma,
  SiVaultwarden,
  SiWordpress,
} from 'react-icons/si';

const HOMARR_ICONS =
  'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png';

/** Simple Icons CDN slug differs from our `icon` key in data.ts */
export const SIMPLE_ICON_SLUG_ALIASES: Record<string, string> = {
  rocketchat: 'rocketdotchat',
};

/** Brands not in Simple Icons / react-icons — static or third-party logo URL */
export const CUSTOM_LOGO_URLS: Record<string, string> = {
  mailcow: `${HOMARR_ICONS}/mailcow.png`,
  typesense: `${HOMARR_ICONS}/typesense.png`,
  openwebui: `${HOMARR_ICONS}/open-webui.png`,
  flowise: `${HOMARR_ICONS}/flowise.png`,
  langfuse: '/service-logos/langfuse.png',
  dokku: '/service-logos/dokku.svg',
};

export const SERVICE_ICON_MAP: Record<string, IconType> = {
  ghost: SiGhost,
  appwrite: SiAppwrite,
  supabase: SiSupabase,
  plausibleanalytics: SiPlausibleanalytics,
  n8n: SiN8N,
  minio: SiMinio,
  redis: SiRedis,
  postgresql: SiPostgresql,
  metabase: SiMetabase,
  meilisearch: SiMeilisearch,
  wordpress: SiWordpress,
  umami: SiUmami,
  grafana: SiGrafana,
  prometheus: SiPrometheus,
  directus: SiDirectus,
  strapi: SiStrapi,
  keycloak: SiKeycloak,
  vaultwarden: SiVaultwarden,
  gitea: SiGitea,
  gitlab: SiGitlab,
  portainer: SiPortainer,
  traefikproxy: SiTraefikproxy,
  nginxproxymanager: SiNginxproxymanager,
  uptimekuma: SiUptimekuma,
  sentry: SiSentry,
  posthog: SiPosthog,
  caldotcom: SiCaldotcom,
  outline: SiOutline,
  notion: SiNotion,
  chatwoot: SiChatwoot,
  mattermost: SiMattermost,
  listmonk: SiListmonk,
  elasticsearch: SiElasticsearch,
  mongodb: SiMongodb,
  mysql: SiMysql,
  clickhouse: SiClickhouse,
  rabbitmq: SiRabbitmq,
  apachekafka: SiApachekafka,
  ollama: SiOllama,
  coolify: SiCoolify,
  pocketbase: SiPocketbase,
  hasura: SiHasura,
  hoppscotch: SiHoppscotch,
  rocketchat: SiRocketdotchat,
};

export function simpleIconSlug(iconKey: string) {
  return SIMPLE_ICON_SLUG_ALIASES[iconKey] ?? iconKey;
}

export function brandLogoUrl(iconKey: string, hex: string) {
  const slug = simpleIconSlug(iconKey);
  return `https://cdn.simpleicons.org/${slug}/${hex.replace('#', '')}`;
}

/** Dark brand colors disappear on zinc cards — lift icon tint when needed */
export function iconDisplayColor(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.38 ? '#F4F4F5' : hex;
}

export function resolveServiceLogo(iconKey: string, brandColor: string) {
  if (
    iconKey.startsWith('/') ||
    iconKey.startsWith('http://') ||
    iconKey.startsWith('https://') ||
    iconKey.startsWith('data:')
  ) {
    return { kind: 'image' as const, src: iconKey };
  }
  if (iconKey in SERVICE_ICON_MAP) {
    const Icon = SERVICE_ICON_MAP[iconKey];
    return { kind: 'icon' as const, Icon, color: iconDisplayColor(brandColor) };
  }
  const customUrl = CUSTOM_LOGO_URLS[iconKey];
  if (customUrl) {
    return { kind: 'image' as const, src: customUrl };
  }
  return { kind: 'image' as const, src: brandLogoUrl(iconKey, iconDisplayColor(brandColor)) };
}
