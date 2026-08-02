/**
 * Preset avatar hostati su `web/public/avatars/`: in DB salviamo solo il path relativo (es. `avatars/fox.png`),
 * l'URL assoluto si compone a runtime sull'origin web. Domain-independent e riusabile anche dal web (same-origin).
 */

// Origin del web (Next.js) derivato dall'endpoint GraphQL, togliendo il suffisso /api/graphql: usato per comporre
// gli URL degli asset pubblici. Evito `new URL` per non dipendere da polyfill su Hermes.
const WEB_ORIGIN = (process.env.EXPO_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3000/api/graphql')
  .replace(/\/api\/graphql\/?$/, '')
  .replace(/\/+$/, '');

export type AvatarPreset = { key: string; path: string };

// Path root-assoluti serviti da web/public/ (lo slash iniziale li rende renderizzabili diretti dal web admin);
// l'ordine è quello mostrato nel picker del profilo.
export const AVATAR_PRESETS: AvatarPreset[] = [
  { key: 'fox', path: '/avatars/fox.png' },
  { key: 'owl', path: '/avatars/owl.png' },
  { key: 'panda', path: '/avatars/panda.png' },
];

/**
 * Converte il valore salvato in un URI renderizzabile: gli URL assoluti (avatar remoti o asset locali risolti,
 * che contengono `://`) restano invariati; i path relativi dei preset diventano assoluti sull'origin web.
 * Stringa vuota/nulla -> undefined (l'avatar mostra il fallback).
 */
export function resolveAvatarUri(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value.includes('://')) return value;
  const path = value.startsWith('/') ? value.slice(1) : value;
  return `${WEB_ORIGIN}/${path}`;
}
