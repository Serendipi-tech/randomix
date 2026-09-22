'use client';

import { useMemo, useState, type ComponentType } from 'react';
import {
  FileText,
  HeartPulse,
  Layers,
  LayoutGrid,
  Leaf,
  MessageCircle,
  Music2,
  Plane,
  Shapes,
  ShieldCheck,
  Smartphone,
  Trophy,
  User,
  UtensilsCrossed,
  Wallet,
  Home as HomeIcon,
  MoveRight,
} from 'lucide-react';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { ICON_CATEGORIES, SEARCHABLE_ICONS, type SearchableIcon } from '@/utils/lucideIconCategories';
import { translateSearchQuery } from '@/utils/itEnIconSearchDictionary';
import { Input } from '@/components/molecules/Input';

interface IconPickerSheetProps {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (name: string) => void;
}

// Icona rappresentativa per ogni categoria, usata come tab (stile picker emoji): niente testo sui bottoni.
const CATEGORY_TAB_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  people: User,
  nature: Leaf,
  food: UtensilsCrossed,
  travel: Plane,
  sports: Trophy,
  devices: Smartphone,
  communication: MessageCircle,
  business: Wallet,
  media: Music2,
  home: HomeIcon,
  shapes: Shapes,
  arrows: MoveRight,
  text: FileText,
  health: HeartPulse,
  security: ShieldCheck,
  other: LayoutGrid,
};

const SEARCH_RESULTS_LIMIT = 60;

/** Cerca prima per sostringa esatta (query originale o tradotta EN); se non trova nulla, un fallback
 *  "approssimato" per prefisso tra le parole della query e quelle di slug/tag di ogni icona. */
function searchIcons(query: string): SearchableIcon[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];
  const translated = translateSearchQuery(raw);
  const terms = Array.from(new Set([raw, translated]));

  const exact = SEARCHABLE_ICONS.filter((icon) => terms.some((term) => icon.haystack.includes(term)));
  if (exact.length > 0) return exact.slice(0, SEARCH_RESULTS_LIMIT);

  const queryWords = translated.split(/\s+/).filter(Boolean);
  const fuzzy = SEARCHABLE_ICONS.filter((icon) => {
    const haystackWords = icon.haystack.split(/[\s-]+/);
    return queryWords.some((qw) => haystackWords.some((hw) => hw.startsWith(qw) || qw.startsWith(hw)));
  });
  return fuzzy.slice(0, SEARCH_RESULTS_LIMIT);
}

// Modale di scelta icona: ricerca + tab categoria + griglia, stesso registry/euristica di mobile (IconPickerSheet).
export function IconPickerSheet({ open, onClose, selected, onSelect }: IconPickerSheetProps) {
  const [activeCategory, setActiveCategory] = useState(ICON_CATEGORIES[0]?.key);
  const [search, setSearch] = useState('');

  const categoryMatch = useMemo(() => {
    const raw = search.trim().toLowerCase();
    if (!raw) return undefined;
    return ICON_CATEGORIES.find((c) => c.label.toLowerCase().includes(raw) || c.key.includes(raw));
  }, [search]);

  const searchResults = useMemo(() => {
    if (!search.trim() || categoryMatch) return null;
    return searchIcons(search);
  }, [search, categoryMatch]);

  if (!open) return null;

  const displayCategory = categoryMatch ?? ICON_CATEGORIES.find((c) => c.key === activeCategory) ?? ICON_CATEGORIES[0];
  const displayedIcons = searchResults ? searchResults.map((r) => r.name) : (displayCategory?.icons ?? []);

  const handleSelectTab = (key: string) => {
    setSearch('');
    setActiveCategory(key);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-foreground p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-color">Scegli un&apos;icona</h2>
          <button onClick={onClose} className="text-disabled hover:text-text-color" aria-label="Chiudi">
            ✕
          </button>
        </div>

        <Input name="icon-search" placeholder="Cerca un'icona…" value={search} onChangeText={setSearch} />

        <div className="my-3 flex gap-2 overflow-x-auto pb-1">
          {ICON_CATEGORIES.map((category) => {
            const TabIcon = CATEGORY_TAB_ICONS[category.key] ?? Layers;
            const isActive = !searchResults && category.key === displayCategory?.key;
            return (
              <button
                key={category.key}
                onClick={() => handleSelectTab(category.key)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive ? 'bg-secondary/20 text-secondary' : 'text-text-color hover:bg-background'
                }`}
                aria-label={category.label}
              >
                <TabIcon size={20} />
              </button>
            );
          })}
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-disabled">
          {searchResults ? 'Risultati ricerca' : displayCategory?.label}
        </p>

        <div className="grid grid-cols-8 gap-2 overflow-y-auto">
          {displayedIcons.length === 0 && searchResults && (
            <p className="col-span-8 py-3 text-sm text-disabled">Nessun risultato</p>
          )}
          {displayedIcons.map((name) => {
            const Icon = getLucideIcon(name);
            if (!Icon) return null;
            const isSelected = selected === name;
            return (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  onClose();
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isSelected ? 'bg-secondary/20 text-secondary' : 'text-text-color hover:bg-background'
                }`}
              >
                <Icon size={22} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
