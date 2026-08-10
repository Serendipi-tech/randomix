import type { ComponentType } from 'react';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import {
  List,
  Book,
  Film,
  Music,
  Gamepad2,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  Tv,
  Palette,
  Star,
  Heart,
  Coffee,
  Dumbbell,
  Plane,
  Camera,
  Gift,
  Sparkles,
  Drama,
  Newspaper,
} from 'lucide-react-native';

export type ListIconKey =
  | 'list'
  | 'book'
  | 'film'
  | 'music'
  | 'gamepad'
  | 'food'
  | 'map'
  | 'shopping'
  | 'tv'
  | 'palette'
  | 'star'
  | 'heart'
  | 'coffee'
  | 'fitness'
  | 'travel'
  | 'camera'
  | 'gift'
  | 'sparkles'
  | 'theatre'
  | 'news';

type IconComponent = ComponentType<{ size?: number; color?: string }>;

/** Set fisso di icone Lucide selezionabili come icona di una lista: niente più testo libero. */
export const LIST_ICONS: { key: ListIconKey; icon: IconComponent }[] = [
  { key: 'list', icon: List },
  { key: 'book', icon: Book },
  { key: 'film', icon: Film },
  { key: 'music', icon: Music },
  { key: 'gamepad', icon: Gamepad2 },
  { key: 'food', icon: UtensilsCrossed },
  { key: 'map', icon: MapPin },
  { key: 'shopping', icon: ShoppingBag },
  { key: 'tv', icon: Tv },
  { key: 'palette', icon: Palette },
  { key: 'star', icon: Star },
  { key: 'heart', icon: Heart },
  { key: 'coffee', icon: Coffee },
  { key: 'fitness', icon: Dumbbell },
  { key: 'travel', icon: Plane },
  { key: 'camera', icon: Camera },
  { key: 'gift', icon: Gift },
  { key: 'sparkles', icon: Sparkles },
  { key: 'theatre', icon: Drama },
  { key: 'news', icon: Newspaper },
];

export const DEFAULT_LIST_ICON_KEY: ListIconKey = 'list';

/** Risolve il valore salvato in `list.icon` sull'icona: prima come nome export Lucide (nuovo picker, es. "BookSearch"),
 *  poi come chiave legacy del set fisso (`ListIconKey`); fallback all'icona di default se nessuno combacia. */
export function resolveListIcon(key?: string | null): IconComponent {
  if (!key) return List;
  return getLucideIcon(key) ?? LIST_ICONS.find((entry) => entry.key === key)?.icon ?? List;
}
