// Genera mobile/src/utils/lucideIconRegistry.ts e web/src/utils/lucideIconRegistry.ts dalla STESSA
// lista curata di icone, perché il picker admin (web) non proponga mai un'icona che mobile non può
// disegnare — causa del bug "categoria senza icona" (molte Category/ListCategory usavano nomi fuori
// dal sottoinsieme bundlato lato mobile). Prima era generato solo lato mobile (per limitare cosa
// Metro impacchetta, ~1600 icone totali farebbero crashare Expo Go per memoria); ora un solo script
// scrive entrambi i registri, così non possono più disallinearsi per dimenticanza.
//
// Rigenerare dopo aver cambiato CATEGORY_KEYWORDS / MAX_ICONS_PER_CATEGORY / ICON_WHITELIST:
//   node scripts/gen-icon-registry.mjs
//
// NB: la logica di raggruppamento per categoria in web/src/utils/lucideIconCategories.ts resta
// dinamica (serve anche per i tab/la ricerca del picker), ma filtra già solo sui nomi che
// getLucideIcon riconosce — da qui in poi è lo stesso elenco curato, non più l'intera libreria.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const tags = require('lucide-static/tags.json');

// Nomi export validi: intersezione fra lucide-react-native (mobile) e lucide-react (web) — un'icona
// deve esistere in entrambe le librerie per poter finire nel registro condiviso.
const nativeDts = readFileSync(
  join(repoRoot, 'node_modules/lucide-react-native/dist/lucide-react-native.d.ts'),
  'utf8',
);
const reactDts = readFileSync(join(repoRoot, 'node_modules/lucide-react/dist/lucide-react.d.ts'), 'utf8');
const namesIn = (src) => new Set([...src.matchAll(/^declare const ([A-Za-z0-9_]+)/gm)].map((m) => m[1]));
const nativeValid = namesIn(nativeDts);
const reactValid = namesIn(reactDts);
const validSet = new Set([...nativeValid].filter((n) => reactValid.has(n)));

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

// Icone richieste dal documento LIST_CATEGORIES.md che DEVONO essere incluse
const ICON_WHITELIST = [
  'BookOpen',      // Reading
  'BookMarked',    // Comics & Manga
  'Clapperboard',  // Movies & TV
  'Headphones',    // Listening
  'Music',         // Music
  'Gamepad2',      // Gaming
  'Dices',         // Tabletop
  'UtensilsCrossed', // Food & Dining
  'ChefHat',       // Cooking & Recipes
  'Wine',          // Drinks
  'Plane',         // Travel & Places
  'ShoppingBag',   // Shopping
  'Ticket',        // Things to Do
  'PartyPopper',   // Events & Nightlife
  'Dumbbell',      // Sports & Fitness
  'GraduationCap', // Learning & Study
  'Palette',       // Arts & Culture
  'Drama',         // Live & Stage
  'Smartphone',    // Apps & Tech
  'Heart',         // Date Ideas
  'Gift',          // Wishlist
  'Sparkles',      // Bucket List
  'Shapes',        // Anything
  // Icone delle Category (item) realmente in uso in produzione, non coperte dalle liste per parola chiave sopra
  'BookImage',     // Fumetti
  'Puzzle',        // Altri giochi
  'Dice5',         // Giochi da tavolo
  'Layers',        // Giochi di carte
  'Store',         // Negozi
  'Wrench',        // Servizi
  'Utensils',      // Cibo
  'PenLine',       // Fanfiction
  'Video',         // Video
  'Trophy',        // Sport
  'CalendarDays',  // Eventi
  'Sparkle',       // Personalizzato
];

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
for (const icon of ICON_WHITELIST) {
  if (validSet.has(icon)) browsable.add(icon);
}
for (const [key] of CATEGORY_KEYWORDS) buckets.get(key).sort().slice(0, MAX).forEach((n) => browsable.add(n));
other.sort().slice(0, MAX).forEach((n) => browsable.add(n));
const names = [...browsable].sort();

function registryFile(packageName, header) {
  return [
    ...header,
    "import type { ComponentType } from 'react';",
    'import {',
    ...names.map((n) => `  ${n},`),
    `} from '${packageName}';`,
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
    '/** kebab-case (slug) -> PascalCase, formato export di lucide. */',
    'export function slugToPascalCase(slug: string): string {',
    '  return slug',
    "    .split('-')",
    '    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))',
    "    .join('');",
    '}',
    '',
  ].join('\n');
}

writeFileSync(
  join(repoRoot, 'mobile/src/utils/lucideIconRegistry.ts'),
  registryFile('lucide-react-native', [
    '// File GENERATO da scripts/gen-icon-registry.mjs (radice del repo) — non modificare a mano.',
    '// Import espliciti delle sole icone sfogliabili dal picker: Metro impacchetta solo queste, non',
    "// l'intera libreria lucide-react-native (~1600 icone), che faceva crashare Expo Go per memoria.",
    '// Stesso elenco di web/src/utils/lucideIconRegistry.ts: un admin non può scegliere un\'icona che',
    "// questo file non contiene, altrimenti su mobile non verrebbe mostrata (bug T09, 26/11/2026).",
  ]),
);

writeFileSync(
  join(repoRoot, 'web/src/utils/lucideIconRegistry.ts'),
  registryFile('lucide-react', [
    '// File GENERATO da scripts/gen-icon-registry.mjs (radice del repo) — non modificare a mano.',
    '// Stesso elenco curato di mobile/src/utils/lucideIconRegistry.ts, non la libreria intera: così il',
    "// picker admin non può proporre un'icona che mobile non riesce a disegnare (bug T09, 26/11/2026).",
  ]),
);

console.log(`generato: mobile/src/utils/lucideIconRegistry.ts e web/src/utils/lucideIconRegistry.ts con ${names.length} icone`);
