import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/atoms/button';
import { StickerShape } from '@/components/atoms/sticker-shape';
import { useListDraw } from '@/utils/useListDraw';
import type { ListItemEntry } from '@/utils/useListDetail';

export default function DrawScreen() {
  const { t } = useTranslation('randomizer');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { listId, listColor } = useLocalSearchParams<{ listId: string; listColor?: string }>();
  const { draw, accept, drawing, accepting } = useListDraw();

  const [entry, setEntry] = useState<ListItemEntry | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);

  const runDraw = async (previousEntryId?: string) => {
    setDrawError(null);
    try {
      const result = await draw(listId, previousEntryId);
      setEntry(result);
    } catch (e) {
      setDrawError((e as Error).message);
    }
  };

  // prima estrazione all'apertura della schermata
  useEffect(() => {
    runDraw();
  }, []);

  const handleAccept = async () => {
    if (!entry) return;
    try {
      await accept(entry.id);
      setAccepted(true);
    } catch (e) {
      setDrawError((e as Error).message);
    }
  };

  const accentColor = listColor || colors.primary;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>{t('back')}</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t('draw.title')}</Text>
      </View>

      <View style={styles.center}>
        <StickerShape variant="star" color={colors.warning} size={22} rotation={-12} style={styles.stickerStar} />
        <StickerShape variant="dot" color={colors.success} size={14} style={styles.stickerDot} />

        {drawError ? (
          <Text style={[styles.errorTitle, { color: colors.text }]}>{drawError}</Text>
        ) : entry ? (
          <Animated.View key={entry.id} entering={ZoomIn.springify().damping(14)}>
            <View style={styles.card}>
              <LinearGradient
                colors={[accentColor, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryLabel}>
                  {t(`categories.${entry.userItem.item.category}`, { ns: 'lists' })}
                </Text>
              </View>
              <Text style={styles.itemName}>{entry.userItem.item.name}</Text>
              {entry.userItem.item.myRating && (
                <Text style={styles.ratingText}>
                  {'★'.repeat(entry.userItem.item.myRating.value)}
                  {'☆'.repeat(5 - entry.userItem.item.myRating.value)}
                </Text>
              )}
              {entry.userItem.tags.length > 0 && (
                <View style={styles.tagRow}>
                  {entry.userItem.tags.map((tag) => (
                    <View key={tag.id} style={[styles.tagPill, { backgroundColor: tag.color }]}>
                      <Text style={styles.tagLabel}>{tag.name}</Text>
                    </View>
                  ))}
                </View>
              )}
              {accepted && <Text style={styles.acceptedText}>{t('draw.accepted')}</Text>}
            </View>
          </Animated.View>
        ) : null}
      </View>

      <View style={styles.actions}>
        {accepted ? (
          <Button
            colorScheme={colorScheme}
            label={t('draw.backToList')}
            onPress={() => router.back()}
          />
        ) : (
          <>
            <Button
              colorScheme={colorScheme}
              label={t('draw.accept')}
              onPress={handleAccept}
              loading={accepting}
              disabled={!entry || drawing}
            />
            <Button
              colorScheme={colorScheme}
              variant="secondary"
              label={t('draw.regenerate')}
              onPress={() => runDraw(entry?.id)}
              loading={drawing}
              disabled={!entry && !drawError}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  back: {
    fontSize: 15,
  },
  title: {
    fontSize: 26,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  stickerStar: {
    position: 'absolute',
    top: 30,
    right: 32,
  },
  stickerDot: {
    position: 'absolute',
    bottom: 40,
    left: 28,
  },
  card: {
    alignItems: 'center',
    borderRadius: 28,
    padding: Spacing.five,
    gap: Spacing.three,
    overflow: 'hidden',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: hexToRgba(Colors.light.border, 0.25),
  },
  // 12px consentito solo per i badge
  categoryLabel: {
    fontSize: 12,
    color: Colors.light.border,
  },
  itemName: {
    fontSize: 28,
    color: Colors.light.border,
    textAlign: 'center',
  },
  ratingText: {
    fontSize: 20,
    color: Colors.light.border,
    letterSpacing: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  tagPill: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tagLabel: {
    fontSize: 12,
    color: Colors.light.border,
  },
  acceptedText: {
    fontSize: 16,
    color: Colors.light.border,
  },
  errorTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
