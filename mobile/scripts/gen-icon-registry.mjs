// Genera src/utils/lucideIconRegistry.ts: import espliciti delle SOLE icone Lucide sfogliabili dal
// picker (cap 30/categoria dopo dedup), così Metro non impacchetta l'intera libreria (~1600 icone),
// che faceva crashare Expo Go per memoria.
//
// Rigenerare dopo aver cambiato CATEGORY_KEYWORDS / MAX_ICONS_PER_CATEGORY:
//   node mobile/scripts/gen-icon-registry.mjs
//
// NB: la logica di dedup/categoria/cap qui deve restare identica a src/utils/lucideIconCategories.ts.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const mobileRoot = join(here, '..');

const tags = require('lucide-static/tags.json');
// nomi export validi ricavati dai typings del pacchetto installato
const dts = readFileSync(join(mobileRoot, '../node_modules/lucide-react-native/dist/lucide-react-native.d.ts'), 'utf8');
const validSet = new Set([...dts.matchAll(/^declare const ([A-Za-z0-9_]+)/gm)].map((m) => m[1]));

const CATEGORY_KEYWORDS = [
  ['people', ['person', 'people', 'user', 'face', 'body', 'human', 'baby', 'animal', 'pet']],
  ['nature', ['nature', 'plant', 'tree', 'flower', 'weather', 'sun', 'rain', 'snow', 'cloud', 'wind', 'earth', 'mountain', 'water', 'fire']],
  ['food', ['food', 'drink', 'fruit', 'vegetable', 'kitchen', 'cooking', 'meal', 'coffee', 'beverage', 'restaurant']],
  ['travel', ['travel', 'transport', 'vehicle', 'car', 'plane', 'flight', 'train', 'ship', 'map', 'navigation', 'location']],
  ['sports', ['sport', 'game', 'gaming', 'exercise', 'fitness', 'ball', 'play']],
  ['devices', ['device', 'computer', 'phone', 'tech', 'battery', 'wifi', 'bluetooth', 'hardware', 'electronic']],
  ['communication', ['message', 'chat', 'mail', 'email', 'phone call', 'notification', 'communication', 'send']],
  ['business', ['money', 'finance', 'business', 'chart', 'currency', 'payment', 'shopping', 'store', 'bank']],
  ['media', ['music', 'video', 'photo', 'camera', 'image', 'media', 'movie', 'sound', 'audio', 'entertainment']],
  ['home', ['home', 'house', 'building', 'furniture', 'tool', 'object', 'kitchen appliance']],
  ['shapes', ['shape', 'symbol', 'geometry', 'icon shape']],
  ['arrows', ['arrow', 'direction', 'chevron', 'navigation ui']],
  ['text', ['text', 'document', 'file', 'writing', 'edit', 'note', 'book']],
  ['health', ['health', 'medical', 'hospital', 'doctor', 'pill', 'heart rate']],
  ['security', ['security', 'lock', 'shield', 'privacy', 'protection']],
];
const MAX = 30;

const splitWords = (n) => n.match(/[A-Z][a-z0-9]*/g) ?? [n];
const normalize = (w) => w.map((x) => x.replace(/\d+$/, '')).filter(Boolean);
function dedupeGlobal(names) {
  const ww = names.map((n) => ({ name: n, cw: normalize(splitWords(n)) }));
  ww.sort((a, b) => {
    if (a.cw.length !== b.cw.length) return a.cw.length - b.cw.length;
    const an = /\d$/.test(a.name) ? 1 : 0, bn = /\d$/.test(b.name) ? 1 : 0;
    if (an !== bn) return an - bn;
    if (a.name.length !== b.name.length) return a.name.length - b.name.length;
    return a.name.localeCompare(b.name);
  });
  const roots = [], kept = [];
  for (const { name, cw } of ww) {
    if (roots.some((r) => r.length <= cw.length && r.every((w, i) => w === cw[i]))) continue;
    roots.push(cw); kept.push(name);
  }
  return kept;
}
const toPascal = (s) => s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const valid = [];
for (const [slug, t] of Object.entries(tags)) {
  const p = toPascal(slug);
  if (!validSet.has(p)) continue;
  valid.push({ p, h: `${slug} ${t.join(' ')}`.toLowerCase() });
}
const deduped = new Set(dedupeGlobal(valid.map((i) => i.p).sort()));
const dedupedIcons = valid.filter((i) => deduped.has(i.p));

const buckets = new Map(CATEGORY_KEYWORDS.map((c) => [c[0], []]));
const other = [];
for (const { p, h } of dedupedIcons) {
  const c = CATEGORY_KEYWORDS.find((c) => c[1].some((k) => h.includes(k)));
  if (c) buckets.get(c[0]).push(p); else other.push(p);
}
const browsable = new Set();
for (const [key] of CATEGORY_KEYWORDS) buckets.get(key).sort().slice(0, MAX).forEach((n) => browsable.add(n));
other.sort().slice(0, MAX).forEach((n) => browsable.add(n));
const names = [...browsable].sort();

const out = [
  '// File GENERATO da scripts/gen-icon-registry.mjs — non modificare a mano.',
  '// Import espliciti delle sole icone sfogliabili dal picker: Metro impacchetta solo queste, non',
  "// l'intera libreria lucide-react-native (~1600 icone), che faceva crashare Expo Go per memoria.",
  "import type { ComponentType } from 'react';",
  'import {',
  ...names.map((n) => `  ${n},`),
  "} from 'lucide-react-native';",
  '',
  'type IconComponent = ComponentType<{ size?: number; color?: string }>;',
  '',
  'const ICON_REGISTRY: Record<string, IconComponent> = {',
  ...names.map((n) => `  ${n},`),
  '};',
  '',
  '/** Risolve un nome export PascalCase sul componente Lucide, se incluso nel registry. */',
  'export function getLucideIcon(name: string): IconComponent | undefined {',
  '  return ICON_REGISTRY[name];',
  '}',
  '',
  '/** kebab-case (slug) -> PascalCase, formato export di lucide-react-native. */',
  'export function slugToPascalCase(slug: string): string {',
  '  return slug',
  "    .split('-')",
  '    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))',
  "    .join('');",
  '}',
  '',
].join('\n');

writeFileSync(join(mobileRoot, 'src/utils/lucideIconRegistry.ts'), out);
console.log(`generated registry with ${names.length} icons`);
