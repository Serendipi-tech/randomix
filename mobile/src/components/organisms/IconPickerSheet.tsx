import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { getLucideIcon } from '@/utils/lucideIconRegistry';
import { ICON_CATEGORIES } from '@/utils/lucideIconCategories';
import { BottomSheet } from '@/components/organisms/BottomSheet';

type IconPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (name: string) => void;
};

const GRID_GAP = 10;
const MIN_SLOT_SIZE = 40;

/** Bottomsheet di scelta icona: tutte le categorie in un'unica pagina scorrevole, ognuna con il
 *  proprio nome come intestazione di sezione e la relativa griglia di icone. Altezza fissa (65%
 *  schermo), il contenuto scorre internamente. La griglia riempie tutta la larghezza disponibile:
 *  colonne e dimensione slot sono calcolate dalla larghezza misurata, non da una % fissa (che
 *  lascerebbe l'ultima riga incompleta stirata o con margine morto a destra). */
export function IconPickerSheet({ visible, onClose, selected, onSelect }: IconPickerSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { height: screenHeight } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);

  const handleGridLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (Math.abs(width - gridWidth) > 1) setGridWidth(width);
  };

  const columns = gridWidth > 0 ? Math.max(4, Math.floor((gridWidth + GRID_GAP) / (MIN_SLOT_SIZE + GRID_GAP))) : 6;
  const slotSize = gridWidth > 0 ? (gridWidth - (columns - 1) * GRID_GAP) / columns : MIN_SLOT_SIZE;

  return (
    <BottomSheet visible={visible} onClose={onClose} height={screenHeight * 0.65}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ICON_CATEGORIES.map((category) => (
          <View key={category.key}>
            <Text style={[styles.sectionLabel, { color: colors.textColor }]}>
              {t(`form.iconCategories.${category.key}`, category.label)}
            </Text>
            <View style={styles.grid} onLayout={handleGridLayout}>
              {category.icons.map((name) => {
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
            </View>
          </View>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 18,
  },
  sectionLabel: {
    opacity: 0.55,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  iconSlot: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
