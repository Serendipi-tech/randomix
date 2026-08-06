import { useMemo, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { ICON_CATEGORIES, SEARCHABLE_ICONS, type SearchableIcon } from '@/utils/lucideIconCategories';
import { translateSearchQuery } from '@/utils/itEnIconSearchDictionary';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';

type IconPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (name: string) => void;
};

// Icona rappresentativa per ogni categoria, usata come tab (stile picker emoji): niente testo sui bottoni.
const CATEGORY_TAB_ICONS: Record<string, ComponentType<{ size?: number; color?: string }>> = {
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

const GRID_GAP = 10;
const MIN_SLOT_SIZE = 40;
const TAB_SIZE = 40;
const GRID_HORIZONTAL_PADDING = 16 * 2; // deve combaciare con paddingHorizontal di styles.grid
const SEARCH_RESULTS_LIMIT = 60;
const MAX_ICONS_PER_CATEGORY = Math.max(...ICON_CATEGORIES.map((c) => c.icons.length));

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

/** Bottomsheet di scelta icona: una sola categoria visibile alla volta, cambiata da una riga di tab
 *  a sola icona (stile picker emoji/WhatsApp). Ricerca: se il testo corrisponde al nome di una
 *  categoria la apre direttamente, altrimenti cerca tra tutte le icone (nome/tag, con traduzione
 *  IT->EN delle parole comuni) e mostra i risultati in una griglia piatta. Altezza fissa: la zona
 *  griglia ha sempre l'altezza necessaria per la categoria più popolata, così lo sheet non cambia
 *  dimensione passando da una categoria piccola a una grande. */
export function IconPickerSheet({ visible, onClose, selected, onSelect }: IconPickerSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [gridWidth, setGridWidth] = useState(0);
  const [activeCategory, setActiveCategory] = useState(ICON_CATEGORIES[0]?.key);
  const [search, setSearch] = useState('');

  const handleGridLayout = (e: LayoutChangeEvent) => {
    // onLayout misura il frame della ScrollView (senza il padding di contentContainerStyle): lo tolgo qui
    const width = e.nativeEvent.layout.width - GRID_HORIZONTAL_PADDING;
    if (Math.abs(width - gridWidth) > 1) setGridWidth(width);
  };

  const columns = gridWidth > 0 ? Math.max(4, Math.floor((gridWidth + GRID_GAP) / (MIN_SLOT_SIZE + GRID_GAP))) : 6;
  const slotSize = gridWidth > 0 ? (gridWidth - (columns - 1) * GRID_GAP) / columns : MIN_SLOT_SIZE;
  // altezza fissa calcolata sulla categoria con più icone: uguale per tutte, non "salta" cambiando categoria
  const rows = Math.ceil(MAX_ICONS_PER_CATEGORY / columns);
  const gridHeight = rows * slotSize + Math.max(0, rows - 1) * GRID_GAP;

  const categoryMatch = useMemo(() => {
    const raw = search.trim().toLowerCase();
    if (!raw) return undefined;
    return ICON_CATEGORIES.find((c) => {
      const translatedLabel = t(`form.iconCategories.${c.key}`, c.label).toLowerCase();
      return translatedLabel.includes(raw) || c.label.toLowerCase().includes(raw) || c.key.includes(raw);
    });
  }, [search, t]);

  const searchResults = useMemo(() => {
    if (!search.trim() || categoryMatch) return null;
    return searchIcons(search);
  }, [search, categoryMatch]);

  const displayCategory = categoryMatch ?? ICON_CATEGORIES.find((c) => c.key === activeCategory) ?? ICON_CATEGORIES[0];
  const displayedIcons = searchResults ? searchResults.map((r) => r.name) : (displayCategory?.icons ?? []);

  const handleSelectTab = (key: string) => {
    setSearch('');
    setActiveCategory(key);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Input
        variant="text"
        value={search}
        onChangeText={setSearch}
        placeholder={t('form.iconSearchPlaceholder')}
        style={styles.searchWrap}
      />

      <View style={styles.tabWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          style={styles.tabScroll}
        >
          {ICON_CATEGORIES.map((category) => {
            const TabIcon = CATEGORY_TAB_ICONS[category.key] ?? Layers;
            const isActive = !searchResults && category.key === displayCategory?.key;
            return (
              <Pressable
                key={category.key}
                onPress={() => handleSelectTab(category.key)}
                style={[styles.tab, isActive && { backgroundColor: hexToRgba(colors.secondary, 0.15) }]}
              >
                <TabIcon size={20} color={isActive ? colors.secondary : colors.textColor} />
              </Pressable>
            );
          })}
        </ScrollView>
        {/* Fade ai bordi: segnala che la riga scorre oltre le tab visibili */}
        <LinearGradient
          colors={[colors.foreground, hexToRgba(colors.foreground, 0)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.edgeFade, styles.edgeFadeLeft]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[hexToRgba(colors.foreground, 0), colors.foreground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.edgeFade, styles.edgeFadeRight]}
          pointerEvents="none"
        />
      </View>

      <Text style={[styles.categoryTitle, { color: colors.textColor }]}>
        {searchResults
          ? t('form.iconSearchResults')
          : t(`form.iconCategories.${displayCategory?.key}`, displayCategory?.label ?? '')}
      </Text>

      <ScrollView contentContainerStyle={[styles.grid, { minHeight: gridHeight }]} showsVerticalScrollIndicator={false} onLayout={handleGridLayout}>
        {displayedIcons.length === 0 && searchResults && (
          <Text style={[styles.empty, { color: colors.disabled }]}>{t('form.iconNoResults')}</Text>
        )}
        {displayedIcons.map((name) => {
          const Icon = getLucideIcon(name);
          if (!Icon) return null;
          const isSelected = selected === name;
          return (
            <Pressable
              key={name}
              onPress={() => {
                onSelect(name);
                onClose();
              }}
              style={[
                styles.iconSlot,
                { width: slotSize, height: slotSize },
                isSelected && { backgroundColor: hexToRgba(colors.secondary, 0.15) },
              ]}
            >
              <Icon size={22} color={isSelected ? colors.secondary : colors.textColor} />
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabWrap: {
    position: 'relative',
  },
  tabScroll: {
    flexGrow: 0,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  edgeFade: {
    position: 'absolute',
    top: 0,
    bottom: 12,
    width: 24,
  },
  edgeFadeLeft: {
    left: 0,
  },
  edgeFadeRight: {
    right: 0,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.55,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  iconSlot: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: 14,
    paddingVertical: 12,
  },
});
