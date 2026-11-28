import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Clock, Megaphone, Trash2 } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, DisplayFonts, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { CardShell } from '@/components/cards/CardShell';
import { CardSkeleton } from '@/components/atoms/CardSkeleton';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { toRelativeTime } from '@/utils/relativeTime';
import { useNotifications } from '@/utils/useNotifications';

const TILE_SIZE = 36;
const TILE_ICON = 19;
const TIME_ICON = 14;

/** Notifica di sistema per esteso: solo queste hanno una pagina propria (le altre si risolvono
 *  dalla riga del feed) ed è l'unico posto da cui si possono eliminare. */
export default function NotificationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation('notifications');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const { notifications, initialLoading, markAsRead, deleteNotification } = useNotifications();
  const notification = notifications.find((item) => item.id === id) ?? null;

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Aprire la notifica equivale a leggerla
  useEffect(() => {
    if (notification && !notification.markedAsRead) markAsRead(notification.id);
  }, [notification?.id, notification?.markedAsRead]);

  const confirmDelete = async () => {
    setConfirmingDelete(false);
    if (!notification) return;
    await deleteNotification(notification.id);
    router.back();
  };

  const relative = notification ? toRelativeTime(notification.createdAt) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        onBack={() => router.back()}
        action={notification ? { icon: Trash2, onPress: () => setConfirmingDelete(true) } : undefined}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        {notification ? (
          <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
            <View style={styles.block}>
              <View style={styles.titleRow}>
                <View style={[styles.tile, { backgroundColor: hexToRgba(colors.primary, 0.3) }]}>
                  <Megaphone size={TILE_ICON} color={colors.textColor} strokeWidth={1.9} />
                </View>
                <Text style={[styles.title, { color: colors.textColor }]}>{notification.title}</Text>
              </View>

              {notification.body && (
                <Text style={[styles.body, { color: colors.disabled }]}>{notification.body}</Text>
              )}

              {relative && (
                <View style={styles.timeRow}>
                  <Clock size={TIME_ICON} color={colors.disabled} />
                  <Text style={[styles.time, { color: colors.disabled }]}>
                    {t(`time.${relative.unit}`, { count: relative.value })}
                  </Text>
                </View>
              )}
            </View>
          </CardShell>
        ) : initialLoading ? (
          <CardSkeleton titled rows={4} />
        ) : (
          <EmptyState title={t('detail.notFound')} />
        )}
      </ScrollView>

      <ConfirmSheet
        visible={confirmingDelete}
        title={t('detail.deleteConfirm.title')}
        message={t('detail.deleteConfirm.message')}
        confirmLabel={t('detail.deleteConfirm.confirm')}
        cancelLabel={t('detail.deleteConfirm.cancel')}
        colorScheme={colorScheme}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
  },
  block: {
    paddingVertical: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 19,
    lineHeight: 25,
    fontFamily: DisplayFonts.semiBold,
  },
  // Testo a pacchetto pieno: i margini destro e sinistro restano dritti come in un articolo
  body: {
    marginTop: Spacing.three,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
  },
  timeRow: {
    marginTop: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  time: {
    fontSize: 13,
  },
});
