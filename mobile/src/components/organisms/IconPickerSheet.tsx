import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView as GHScrollView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  LayoutGrid,
  Leaf,
  MessageCircle,
  Music2,
  Plane,
  Shapes,
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
  business: Wallet,
  media: Music2,
  home: HomeIcon,
  shapes: Shapes,
  arrows: MoveRight,
  text: FileText,
  utility: MessageCircle,
  other: LayoutGrid,
};

const GRID_GAP = 7;
// Larghezza minima di uno slot: determina quante colonne entrano. Tarata a 44 così, con la larghezza
// del grid ora calcolata a piena larghezza, i telefoni standard mostrano 6 colonne (schermi più larghi 7).
const MIN_SLOT_SIZE = 44;
const TAB_SIZE = 40;
const GRID_HORIZONTAL_PADDING = 16 * 2; // deve combaciare con paddingHorizontal di styles.grid
// Inset noti dello sheet: servono a calcolare la larghezza reale del grid dalla finestra, in modo
// deterministico (senza dipendere da una misura onLayout che sul dispositivo tornava troppo stretta).
const SHEET_HORIZONTAL_INSET = 12 * 2; // anchor left+right in BottomSheet
const SHEET_BORDER = 1 * 2; // borderWidth del container in BottomSheet
// Spostamento orizzontale minimo per far scattare il cambio categoria con lo swipe
const SWIPE_THRESHOLD = 40;
const TAB_GAP = 8;
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
  const { width: windowWidth } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState(ICON_CATEGORIES[0]?.key);
  const [search, setSearch] = useState('');

  // Larghezza reale del grid = finestra meno inset dello sheet, bordi e padding: deterministica e sempre piena
  const gridWidth = windowWidth - SHEET_HORIZONTAL_INSET - SHEET_BORDER - GRID_HORIZONTAL_PADDING;

  const columns = Math.max(4, Math.floor((gridWidth + GRID_GAP) / (MIN_SLOT_SIZE + GRID_GAP)));
  // Slot arrotondato per difetto: i pixel di resto vengono ridistribuiti nel columnGap, così ogni riga
  // riempie ESATTAMENTE la larghezza disponibile (niente spazio vuoto sul bordo destro).
  const slotSize = Math.floor((gridWidth - (columns - 1) * GRID_GAP) / columns);
  const columnGap = columns > 1 ? (gridWidth - slotSize * columns) / (columns - 1) : GRID_GAP;
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

  // Navigazione tra categorie adiacenti (frecce + swipe): frecce disattive ai bordi
  const currentIndex = ICON_CATEGORIES.findIndex((c) => c.key === displayCategory?.key);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < ICON_CATEGORIES.length - 1;
  const goToCategory = (index: number) => {
    const target = ICON_CATEGORIES[index];
    if (target) handleSelectTab(target.key);
  };
  const goPrev = () => goToCategory(currentIndex - 1);
  const goNext = () => goToCategory(currentIndex + 1);

  // Mantiene la tab attiva visibile nella striscia orizzontale quando si cambia categoria
  const tabScrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (currentIndex < 0) return;
    const x = Math.max(0, currentIndex * (TAB_SIZE + TAB_GAP) - TAB_SIZE);
    tabScrollRef.current?.scrollTo({ x, animated: true });
  }, [currentIndex]);

  // Carosello: tutte le categorie sono pannelli contigui su una riga; la riga si trasla di
  // -currentIndex*panelWidth. Così durante lo swipe la categoria adiacente è già attaccata: niente vuoto in mezzo.
  const panelWidth = gridWidth + GRID_HORIZONTAL_PADDING; // larghezza visibile di un pannello (= larghezza interna dello sheet)
  const tx = useSharedValue(-currentIndex * panelWidth);
  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  // Riporta la riga sulla categoria corrente al cambio: istantaneo al primo render e sui salti non adiacenti
  // (tab lontane, dove uno slide lungo mostrerebbe pannelli non renderizzati); animato tra categorie adiacenti.
  const firstRun = useRef(true);
  const prevIdxRef = useRef(currentIndex);
  useEffect(() => {
    if (currentIndex < 0) return;
    const rest = -currentIndex * panelWidth;
    const delta = Math.abs(currentIndex - prevIdxRef.current);
    prevIdxRef.current = currentIndex;
    if (firstRun.current || delta > 1) {
      firstRun.current = false;
      tx.value = rest;
      return;
    }
    tx.value = withTiming(rest, { duration: 240, easing: Easing.out(Easing.cubic) });
  }, [currentIndex, panelWidth]);

  // Swipe orizzontale sull'area icone: trascina la riga e committa la categoria adiacente a fine gesto.
  // activeOffsetX: parte solo con movimento orizzontale netto; failOffsetY: cede al gesto verticale.
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-16, 16])
    .onUpdate((e) => {
      const base = -currentIndex * panelWidth;
      // Ai bordi (nessuna categoria oltre) il trascinamento resiste invece di scorrere a vuoto
      const blocked = (e.translationX < 0 && !canNext) || (e.translationX > 0 && !canPrev);
      tx.value = base + (blocked ? e.translationX * 0.25 : e.translationX);
    })
    .onEnd((e) => {
      const goingNext = e.translationX <= -SWIPE_THRESHOLD && canNext;
      const goingPrev = e.translationX >= SWIPE_THRESHOLD && canPrev;
      const target = goingNext ? currentIndex + 1 : goingPrev ? currentIndex - 1 : currentIndex;
      // Anima SUBITO verso il pannello (già montato) sul thread UI; il commit dello stato (re-render
      // pesante) avviene solo a fine slide, così non blocca l'animazione.
      tx.value = withTiming(-target * panelWidth, { duration: 220, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished && target !== currentIndex) runOnJS(goToCategory)(target);
      });
    });

  // Icone di una categoria (riusato dai pannelli del carosello e dalla lista di ricerca)
  const renderSlots = (names: string[]) =>
    names.map((name) => {
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
            isSelected && { backgroundColor: hexToRgba(colors.primary, 0.15) },
          ]}
        >
          <Icon size={22} color={isSelected ? colors.primary : colors.textColor} />
        </Pressable>
      );
    });

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Input
        variant="text"
        value={search}
        onChangeText={setSearch}
        placeholder={t('form.iconSearchPlaceholder')}
        style={styles.searchWrap}
      />

      <View style={styles.tabBar}>
        {/* Frecce: indicano/consentono lo spostamento tra categorie, disattive ai bordi */}
        <Pressable onPress={goPrev} disabled={!canPrev} hitSlop={8} style={styles.arrowBtn}>
          <ChevronLeft size={22} color={canPrev ? colors.textColor : colors.disabled} />
        </Pressable>

        <View style={styles.tabWrap}>
          <ScrollView
            ref={tabScrollRef}
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
                  style={[styles.tab, isActive && { backgroundColor: hexToRgba(colors.primary, 0.15) }]}
                >
                  <TabIcon size={20} color={isActive ? colors.primary : colors.textColor} />
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

        <Pressable onPress={goNext} disabled={!canNext} hitSlop={8} style={styles.arrowBtn}>
          <ChevronRight size={22} color={canNext ? colors.textColor : colors.disabled} />
        </Pressable>
      </View>

      <Text style={[styles.categoryTitle, { color: colors.textColor }]}>
        {searchResults
          ? t('form.iconSearchResults')
          : t(`form.iconCategories.${displayCategory?.key}`, displayCategory?.label ?? '')}
      </Text>

      {searchResults ? (
        // Ricerca: lista verticale scrollabile (qui lo swipe tra categorie non serve)
        <GHScrollView contentContainerStyle={[styles.grid, { minHeight: gridHeight, columnGap, rowGap: GRID_GAP }]} showsVerticalScrollIndicator={false}>
          {displayedIcons.length === 0 && (
            <Text style={[styles.empty, { color: colors.disabled }]}>{t('form.iconNoResults')}</Text>
          )}
          {renderSlots(displayedIcons)}
        </GHScrollView>
      ) : (
        // Carosello categorie: pannelli contigui, swipe laterale sull'area icone per cambiare categoria.
        // L'area del gesto è statica (copre il viewport); solo la riga interna trasla.
        <View style={[styles.carousel, { height: gridHeight }]}>
          <GestureDetector gesture={swipeGesture}>
            <View style={styles.carouselTouch}>
              <Animated.View style={[styles.carouselRow, rowStyle]}>
                {ICON_CATEGORIES.map((cat, i) => {
                  // Renderizzo solo la categoria corrente e le adiacenti: basta a coprire lo swipe
                  if (Math.abs(i - currentIndex) > 1) return null;
                  return (
                    <View key={cat.key} style={[styles.panel, { left: i * panelWidth, width: panelWidth, height: gridHeight }]}>
                      <View style={[styles.panelGrid, { columnGap, rowGap: GRID_GAP }]}>{renderSlots(cat.icons)}</View>
                    </View>
                  );
                })}
              </Animated.View>
            </View>
          </GestureDetector>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  arrowBtn: {
    width: 28,
    height: TAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWrap: {
    flex: 1,
    position: 'relative',
  },
  tabScroll: {
    flexGrow: 0,
  },
  tabRow: {
    flexDirection: 'row',
    gap: TAB_GAP,
    paddingHorizontal: 4,
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
    bottom: 0,
    width: 20,
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  // Viewport del carosello: mostra un solo pannello per volta, i vicini sono ritagliati
  carousel: {
    overflow: 'hidden',
    marginBottom: 24,
  },
  // Area statica che cattura lo swipe (non trasla, così l'hit-area resta sul viewport)
  carouselTouch: {
    flex: 1,
  },
  // Riga traslabile che contiene i pannelli affiancati
  carouselRow: {
    height: '100%',
  },
  // Pannello di una categoria, posizionato al proprio offset orizzontale
  panel: {
    position: 'absolute',
    top: 0,
  },
  panelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
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
