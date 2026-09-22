import tags from 'lucide-static/tags.json';
import { getLucideIcon, slugToPascalCase } from '@/utils/lucideIconRegistry';

export type IconCategory = {
  key: string;
  label: string;
  icons: string[]; // nomi export PascalCase di lucide-react
};

export type SearchableIcon = {
  name: string; // nome export PascalCase
  categoryKey: string; // categoria di appartenenza (per saltarci quando trovata da ricerca)
  haystack: string; // slug + tag ufficiali, minuscolo, per il match testuale
};

// Poche parole chiave per macroargomento: il raggruppamento è euristico (basato sui tag ufficiali
// di lucide-static), non la categorizzazione esatta del sito lucide.dev.
const CATEGORY_KEYWORDS: { key: string; label: string; keywords: string[] }[] = [
  { key: 'people', label: 'Persone e animali', keywords: ['person', 'people', 'user', 'face', 'body', 'human', 'baby', 'animal', 'pet'] },
  { key: 'nature', label: 'Natura e meteo', keywords: ['nature', 'plant', 'tree', 'flower', 'weather', 'sun', 'rain', 'snow', 'cloud', 'wind', 'earth', 'mountain', 'water', 'fire'] },
  { key: 'food', label: 'Cibo e bevande', keywords: ['food', 'drink', 'fruit', 'vegetable', 'kitchen', 'cooking', 'meal', 'coffee', 'beverage', 'restaurant'] },
  { key: 'travel', label: 'Viaggi e trasporti', keywords: ['travel', 'transport', 'vehicle', 'car', 'plane', 'flight', 'train', 'ship', 'map', 'navigation', 'location'] },
  { key: 'sports', label: 'Sport e tempo libero', keywords: ['sport', 'game', 'gaming', 'exercise', 'fitness', 'ball', 'play'] },
  { key: 'devices', label: 'Tecnologia e dispositivi', keywords: ['device', 'computer', 'phone', 'tech', 'battery', 'wifi', 'bluetooth', 'hardware', 'electronic'] },
  { key: 'communication', label: 'Comunicazione', keywords: ['message', 'chat', 'mail', 'email', 'phone call', 'notification', 'communication', 'send'] },
  { key: 'business', label: 'Business e finanza', keywords: ['money', 'finance', 'business', 'chart', 'currency', 'payment', 'shopping', 'store', 'bank'] },
  { key: 'media', label: 'Media e intrattenimento', keywords: ['music', 'video', 'photo', 'camera', 'image', 'media', 'movie', 'sound', 'audio', 'entertainment'] },
  { key: 'home', label: 'Casa e oggetti', keywords: ['home', 'house', 'building', 'furniture', 'tool', 'object', 'kitchen appliance'] },
  { key: 'shapes', label: 'Forme e simboli', keywords: ['shape', 'symbol', 'geometry', 'icon shape'] },
  { key: 'arrows', label: 'Frecce e navigazione UI', keywords: ['arrow', 'direction', 'chevron', 'navigation ui'] },
  { key: 'text', label: 'Testo e documenti', keywords: ['text', 'document', 'file', 'writing', 'edit', 'note', 'book'] },
  { key: 'health', label: 'Salute', keywords: ['health', 'medical', 'hospital', 'doctor', 'pill', 'heart rate'] },
  { key: 'security', label: 'Sicurezza', keywords: ['security', 'lock', 'shield', 'privacy', 'protection'] },
];

const OTHER_CATEGORY: Pick<IconCategory, 'key' | 'label'> = { key: 'other', label: 'Altro' };
const MAX_ICONS_PER_CATEGORY = 30;

/** Spezza un nome PascalCase in parole sui confini di maiuscola (es. "AccountDelete" -> ["Account","Delete"]). */
function splitPascalWords(name: string): string[] {
  return name.match(/[A-Z][a-z0-9]*/g) ?? [name];
}

/** Parole normalizzate per il confronto: toglie i numeri finali da ogni parola, così serie come
 *  "Clock1".."Clock12" o "Volume1"/"Volume2" contano come varianti di "Clock"/"Volume" (altrimenti
 *  ogni numero è un token diverso e nessuno viene scartato). */
function normalizeForCompare(words: string[]): string[] {
  return words.map((w) => w.replace(/\d+$/, '')).filter(Boolean);
}

/** Tiene solo le icone "radice" di un elenco: se "Account"/"Clock" sono presenti, scarta le varianti
 *  ("AccountDelete", "Clock1"..."Clock12"...) confrontando le parole PascalCase per intero (numeri
 *  finali ignorati), non per sottostringa (così "Car" non scarta "Card"). Applicata UNA VOLTA su
 *  tutto l'elenco globale delle icone, PRIMA di smistarle nelle categorie — altrimenti il cap per
 *  categoria si applicherebbe già a un sottoinsieme "sporco" di varianti, riducendo artificialmente
 *  quante icone uniche restano disponibili per categoria. */
function dedupeGlobal(names: string[]): string[] {
  const withWords = names.map((name) => {
    const words = splitPascalWords(name);
    return { name, compareWords: normalizeForCompare(words) };
  });

  // priorità: meno parole prima, nomi senza suffisso numerico prima, poi più corti, poi alfabetico
  withWords.sort((a, b) => {
    if (a.compareWords.length !== b.compareWords.length) return a.compareWords.length - b.compareWords.length;
    const aNumbered = /\d$/.test(a.name) ? 1 : 0;
    const bNumbered = /\d$/.test(b.name) ? 1 : 0;
    if (aNumbered !== bNumbered) return aNumbered - bNumbered;
    if (a.name.length !== b.name.length) return a.name.length - b.name.length;
    return a.name.localeCompare(b.name);
  });

  const roots: string[][] = [];
  const kept: string[] = [];
  for (const { name, compareWords } of withWords) {
    const isVariant = roots.some((root) => root.length <= compareWords.length && root.every((w, i) => w === compareWords[i]));
    if (isVariant) continue;
    roots.push(compareWords);
    kept.push(name);
  }

  return kept;
}

/** Raggruppa tutte le icone Lucide disponibili in macroargomenti, cercando le parole chiave
 *  di CATEGORY_KEYWORDS dentro slug + tag ufficiali (lucide-static/tags.json).
 *
 *  Ordine delle operazioni (importante): 1) valido tutte le icone reali, 2) deduplico le varianti
 *  A MONTE su tutto l'elenco globale, 3) smisto le icone deduplicate nelle categorie (una sola
 *  categoria a testa, la prima che matcha — mai duplicata tra sezioni), 4) taglio a
 *  MAX_ICONS_PER_CATEGORY solo a questo punto. Così il limite per categoria non viene "consumato"
 *  da varianti che sarebbero comunque state scartate. */
function buildIconData(): { categories: IconCategory[]; searchable: SearchableIcon[] } {
  const validIcons: { pascal: string; haystack: string }[] = [];
  for (const [slug, iconTags] of Object.entries(tags as Record<string, string[]>)) {
    const pascal = slugToPascalCase(slug);
    if (!getLucideIcon(pascal)) continue; // solo icone realmente esportate dalla libreria installata
    validIcons.push({ pascal, haystack: `${slug} ${iconTags.join(' ')}`.toLowerCase() });
  }

  const dedupedNames = new Set(dedupeGlobal(validIcons.map((i) => i.pascal).sort()));
  const dedupedIcons = validIcons.filter((i) => dedupedNames.has(i.pascal));

  const buckets = new Map<string, Set<string>>(CATEGORY_KEYWORDS.map((c) => [c.key, new Set<string>()]));
  const other = new Set<string>();
  // indice di ricerca: TUTTE le icone deduplicate con la loro categoria, non solo le prime
  // MAX_ICONS_PER_CATEGORY mostrate sfogliando — altrimenti la ricerca "perderebbe" le icone tagliate dal cap.
  const searchable: SearchableIcon[] = [];

  for (const { pascal, haystack } of dedupedIcons) {
    const category = CATEGORY_KEYWORDS.find((c) => c.keywords.some((keyword) => haystack.includes(keyword)));
    const categoryKey = category?.key ?? OTHER_CATEGORY.key;
    if (category) {
      buckets.get(category.key)!.add(pascal);
    } else {
      other.add(pascal);
    }
    searchable.push({ name: pascal, categoryKey, haystack });
  }

  const categories = CATEGORY_KEYWORDS.map((c) => ({
    key: c.key,
    label: c.label,
    icons: Array.from(buckets.get(c.key)!).sort().slice(0, MAX_ICONS_PER_CATEGORY),
  })).filter((c) => c.icons.length > 0);

  if (other.size > 0) {
    categories.push({ ...OTHER_CATEGORY, icons: Array.from(other).sort().slice(0, MAX_ICONS_PER_CATEGORY) });
  }

  return { categories, searchable };
}

const { categories: builtCategories, searchable: builtSearchable } = buildIconData();

export const ICON_CATEGORIES: IconCategory[] = builtCategories;
/** Tutte le icone deduplicate (non limitate a MAX_ICONS_PER_CATEGORY), per la ricerca: sfogliare
 *  le categorie mostra solo le prime N, ma cercare per nome deve poter trovare qualsiasi icona. */
export const SEARCHABLE_ICONS: SearchableIcon[] = builtSearchable;
