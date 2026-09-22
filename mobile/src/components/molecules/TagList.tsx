import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { Tag } from '@/components/atoms/Tag';

type TagListProps = {
  tags: Array<{ name: string; color: string }>;
  expandable?: boolean;
  onRemoveTag?: (index: number) => void;
  onAddTag?: () => void;
  /** Numero massimo di righe prima del badge "+N" (default 1). */
  maxLines?: number;
};

// Tag ordinati per lunghezza del nome: mantengo l'indice originale per rimozione via prop
type IndexedTag = { name: string; color: string; originalIndex: number };

const TAG_OVERFLOW_GAP = 6;
const TAG_OVERFLOW_BADGE_WIDTH = 34;

/** Riga di tag con troncamento automatico: misura le larghezze off-screen e mostra un badge "+N"
 *  per l'overflow. Se `expandable`, il badge espande la riga al tap. Logica di misura tutta interna. */
export function TagList({ tags, expandable = false, onRemoveTag, onAddTag, maxLines = 1 }: TagListProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const indexedTags: IndexedTag[] = tags.map((tag, i) => ({ ...tag, originalIndex: i }));
  const sortedTags = [...indexedTags].sort((a, b) => a.name.length - b.name.length);

  const [containerWidth, setContainerWidth] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<Record<number, number>>({});
  const [expanded, setExpanded] = useState(false);

  const handleMeasure = (index: number, width: number) => {
    setMeasuredWidths((prev) => (prev[index] === width ? prev : { ...prev, [index]: width }));
  };

  const allMeasured = containerWidth > 0 && sortedTags.every((tag) => measuredWidths[tag.originalIndex] !== undefined);

  let visibleTags = sortedTags;
  let overflowCount = 0;

  if (allMeasured && !expanded) {
    // Impacchetta i tag su un massimo di `maxLines` righe (stessa larghezza/gap del flexWrap reale)
    const rows: IndexedTag[][] = [[]];
    const rowWidths = [0];
    let count = 0;
    for (; count < sortedTags.length; count++) {
      const tag = sortedTags[count];
      const width = measuredWidths[tag.originalIndex];
      const rowIndex = rows.length - 1;
      const gap = rows[rowIndex].length > 0 ? TAG_OVERFLOW_GAP : 0;
      if (rowWidths[rowIndex] + gap + width <= containerWidth) {
        rows[rowIndex].push(tag);
        rowWidths[rowIndex] += gap + width;
      } else if (rows.length < maxLines) {
        rows.push([tag]);
        rowWidths.push(width);
      } else {
        break;
      }
    }

    // Se c'è overflow, restringe l'ultima riga finché non entra anche il badge "+N"
    if (count < sortedTags.length) {
      const lastRowIndex = rows.length - 1;
      while (rows[lastRowIndex].length > 0) {
        const width = rows[lastRowIndex].reduce(
          (sum, tag, i) => sum + measuredWidths[tag.originalIndex] + (i > 0 ? TAG_OVERFLOW_GAP : 0),
          0,
        );
        const gap = rows[lastRowIndex].length > 0 ? TAG_OVERFLOW_GAP : 0;
        if (width + gap + TAG_OVERFLOW_BADGE_WIDTH <= containerWidth) break;
        rows[lastRowIndex].pop();
        count--;
      }
    }

    visibleTags = rows.flat();
    overflowCount = sortedTags.length - visibleTags.length;
  }

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {/* Riga fantasma per misurare la larghezza reale di ogni tag */}
      <View style={styles.measureRow} pointerEvents="none">
        <View style={styles.row}>
          {sortedTags.map((tag) => (
            <View key={tag.originalIndex} onLayout={(e) => handleMeasure(tag.originalIndex, e.nativeEvent.layout.width)}>
              <Tag name={tag.name} color={tag.color} compact />
            </View>
          ))}
        </View>
      </View>

      {allMeasured && (
        <View style={[styles.visibleRow, { flexWrap: expanded || maxLines > 1 ? 'wrap' : 'nowrap' }]}>
          {visibleTags.map((tag) => (
            <Tag
              key={tag.originalIndex}
              name={tag.name}
              color={tag.color}
              compact
              onRemove={onRemoveTag ? () => onRemoveTag(tag.originalIndex) : undefined}
            />
          ))}

          {overflowCount > 0 &&
            (expandable ? (
              <Pressable onPress={() => setExpanded(true)} style={[styles.overflowBadge, { backgroundColor: hexToRgba(colors.border, 0.2) }]}>
                <Text style={[styles.overflowText, { color: colors.textColor }]}>+{overflowCount}</Text>
              </Pressable>
            ) : (
              <View style={[styles.overflowBadge, { backgroundColor: hexToRgba(colors.border, 0.2) }]}>
                <Text style={[styles.overflowText, { color: colors.textColor }]}>+{overflowCount}</Text>
              </View>
            ))}

          {expanded && (
            <Pressable onPress={() => setExpanded(false)} hitSlop={6}>
              <Text style={[styles.showLess, { color: colors.textColor }]}>{t('itemDetail.showLess')}</Text>
            </Pressable>
          )}

          {onAddTag && (
            <Pressable onPress={onAddTag} style={[styles.addTag, { borderColor: hexToRgba(colors.textColor, 0.3) }]}>
              <Text style={[styles.addTagText, { color: colors.textColor }]}>{t('itemDetail.addTag')}</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  measureRow: {
    position: 'absolute',
    opacity: 0,
  },
  row: {
    flexDirection: 'row',
  },
  visibleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TAG_OVERFLOW_GAP,
  },
  overflowBadge: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  overflowText: {
    fontSize: 12,
    fontWeight: '600',
  },
  showLess: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  addTag: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTagText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
