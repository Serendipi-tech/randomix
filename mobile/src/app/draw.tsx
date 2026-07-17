import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accent, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { StarRating } from '@/components/atoms/star-rating';
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

  const accentColor = listColor || Accent.violet;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>{t('back')}</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t('draw.title')}</Text>
      </View>

      <View style={styles.center}>
        {drawError ? (
          <Text style={[styles.errorTitle, { color: colors.text }]}>{drawError}</Text>
        ) : entry ? (
          <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
            <View style={[styles.categoryBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.categoryLabel}>
                {t(`categories.${entry.userItem.item.category}`, { ns: 'lists' })}
              </Text>
            </View>
            <Text style={[styles.itemName, { color: colors.text }]}>
              {entry.userItem.item.name}
            </Text>
            {entry.userItem.item.myRating && (
              <StarRating
                value={entry.userItem.item.myRating.value}
                size={20}
                colorScheme={colorScheme}
              />
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
            {accepted && (
              <Text style={[styles.acceptedText, { color: Accent.mint }]}>
                {t('draw.accepted')}
              </Text>
            )}
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        {accepted ? (
          <AuthButton
            colorScheme={colorScheme}
            label={t('draw.backToList')}
            onPress={() => router.back()}
          />
        ) : (
          <>
            <AuthButton
              colorScheme={colorScheme}
              label={t('draw.accept')}
              onPress={handleAccept}
              loading={accepting}
              disabled={!entry || drawing}
            />
            <AuthButton
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
    fontFamily: 'Nunito_500Medium',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  card: {
    alignItems: 'center',
    borderRadius: 28,
    padding: Spacing.five,
    gap: Spacing.three,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  // 12px consentito solo per i badge
  categoryLabel: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
  itemName: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Fredoka_700Bold',
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
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
  },
  acceptedText: {
    fontSize: 16,
    fontFamily: 'Fredoka_600SemiBold',
  },
  errorTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
  actions: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
