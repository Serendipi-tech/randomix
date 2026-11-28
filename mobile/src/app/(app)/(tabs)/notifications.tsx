import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Megaphone, Users } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { NotificationCardSkeleton } from '@/components/atoms/notification-card-skeleton';
import { SegmentedControl, type SegmentedOption } from '@/components/atoms/SegmentedControl';
import { Collapsible } from '@/components/atoms/Collapsible';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { DevErrorNotice } from '@/components/atoms/DevErrorNotice';
import { NotificationCard } from '@/components/cards/NotificationCard';
import {
  useNotificationFeed,
  type FeedItem,
  type FeedSectionKey,
  type NotificationFilter,
} from '@/utils/useNotificationFeed';

const SKELETON_COUNT = 4;

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation('notifications');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const listBottomPadding = useNavbarClearance();

  const {
    filter,
    setFilter,
    sections,
    initialLoading,
    error,
    markAsRead,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    acceptInvite,
    rejectInvite,
    cancelInvite,
    dismissRequest,
    dismissInvite,
    answering,
  } = useNotificationFeed();

  const showSkeleton = initialLoading;

  // Stato di apertura delle due sezioni: riguarda solo questa schermata, non il feed
  const [collapsed, setCollapsed] = useState<Record<FeedSectionKey, boolean>>({ new: false, old: false });
  const toggleSection = (key: FeedSectionKey) =>
    setCollapsed((current) => ({ ...current, [key]: !current[key] }));

  const filters: SegmentedOption<NotificationFilter>[] = [
    { value: 'all', label: t('filters.all'), activeColor: colors.primary },
    { value: 'system', label: t('filters.system'), activeColor: colors.primary },
    { value: 'friends', label: t('filters.friends'), activeColor: colors.primary },
    { value: 'groups', label: t('filters.groups'), activeColor: colors.primary },
  ];

  // Testi e aspetto per tipo di riga: le richieste non hanno titolo/corpo in DB, li compone i18n.
  const renderCard = (item: FeedItem) => {
    const timeLabel = t(`time.${item.relative.unit}`, { count: item.relative.value });
    const username = item.user?.username ?? '';

    if (item.kind === 'friendRequest') {
      return (
        <NotificationCard
          title={username}
          body={t('friendRequest.incoming.body')}
          timeLabel={timeLabel}
          accentColor={colors.secondary}
          unread={item.unread}
          avatar={item.user}
          actions={{
            acceptLabel: t('friendRequest.accept'),
            rejectLabel: t('friendRequest.decline'),
            onAccept: () => acceptRequest(item.id),
            onReject: () => rejectRequest(item.id),
            disabled: answering,
          }}
        />
      );
    }

    if (item.kind === 'friendRequestAnswered') {
      return (
        <NotificationCard
          title={username}
          body={t(item.accepted ? 'friendRequest.answered.accepted' : 'friendRequest.answered.declined')}
          timeLabel={timeLabel}
          accentColor={colors.secondary}
          avatar={item.user}
          status={{
            kind: item.accepted ? 'accepted' : 'declined',
            label: t(item.accepted ? 'status.accepted' : 'status.declined'),
          }}
          cancelAction={{
            label: t('remove'),
            onPress: () => dismissRequest(item.id),
            disabled: answering,
          }}
        />
      );
    }

    if (item.kind === 'groupInviteAnswered') {
      return (
        <NotificationCard
          title={item.group?.name ?? ''}
          body={t(item.accepted ? 'groupInvite.answered.accepted' : 'groupInvite.answered.declined', {
            username,
          })}
          timeLabel={timeLabel}
          accentColor={colors.info}
          icon={Users}
          status={{
            kind: item.accepted ? 'accepted' : 'declined',
            label: t(item.accepted ? 'status.accepted' : 'status.declined'),
          }}
          cancelAction={{
            label: t('remove'),
            onPress: () => dismissInvite(item.id),
            disabled: answering,
          }}
        />
      );
    }

    if (item.kind === 'groupInvite') {
      return (
        <NotificationCard
          title={item.group?.name ?? ''}
          body={t('groupInvite.incoming.body', { username })}
          timeLabel={timeLabel}
          accentColor={colors.info}
          unread={item.unread}
          icon={Users}
          actions={{
            acceptLabel: t('friendRequest.accept'),
            rejectLabel: t('friendRequest.decline'),
            onAccept: () => acceptInvite(item.id),
            onReject: () => rejectInvite(item.id),
            disabled: answering,
          }}
        />
      );
    }

    if (item.kind === 'groupInviteSent') {
      return (
        <NotificationCard
          title={item.group?.name ?? ''}
          body={t('groupInvite.sent.body', { username })}
          timeLabel={timeLabel}
          accentColor={colors.info}
          icon={Users}
          status={{ kind: 'pending', label: t('friendRequest.sent.status') }}
          cancelAction={{
            label: t('friendRequest.sent.cancel'),
            onPress: () => {
              if (item.group && item.targetUserId) cancelInvite(item.group.id, item.targetUserId);
            },
            disabled: answering,
          }}
        />
      );
    }

    if (item.kind === 'friendRequestSent') {
      return (
        <NotificationCard
          title={username}
          body={t('friendRequest.sent.body')}
          timeLabel={timeLabel}
          accentColor={colors.secondaryGradient}
          avatar={item.user}
          status={{ kind: 'pending', label: t('friendRequest.sent.status') }}
          cancelAction={{
            label: t('friendRequest.sent.cancel'),
            onPress: () => cancelRequest(item.id),
            disabled: answering,
          }}
        />
      );
    }

    // Solo le notifiche di sistema hanno una pagina propria: le altre si leggono dalla riga
    const isSystem = item.notificationType === 'SYSTEM';

    return (
      <NotificationCard
        title={item.title ?? ''}
        body={item.body}
        timeLabel={timeLabel}
        accentColor={colors.primary}
        unread={item.unread}
        icon={isSystem ? Megaphone : Bell}
        onPress={
          isSystem
            ? () => router.push({ pathname: '/notification/[id]', params: { id: item.id } })
            : item.unread
              ? () => markAsRead(item.id)
              : undefined
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader />
      {/* Fuori dalla ScrollView: i filtri restano fermi, scorrono solo le sezioni */}
      <View style={styles.filters}>
        <SegmentedControl options={filters} value={filter} onChange={setFilter} />
      </View>
      {/* ScrollView come nel profilo, non una lista virtualizzata: il feed è corto e così lo scroll
          e la clearance della navbar si comportano esattamente come nelle altre pagine */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: listBottomPadding }]}
      >
        {showSkeleton ? (
          <View style={styles.skeletons}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <NotificationCardSkeleton key={i} />
            ))}
          </View>
        ) : sections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.textColor }]}>
              {error ? t('error') : t('empty.title')}
            </Text>
            {!error && (
              <Text style={[styles.emptySubtitle, { color: colors.disabled }]}>{t('empty.subtitle')}</Text>
            )}
            <DevErrorNotice error={error} source="myNotifications" />
          </View>
        ) : (
          // Fade leggero quando il contenuto prende il posto dello skeleton: un solo contenitore,
          // non una animazione per riga (quelle falsavano la misura del contenuto scrollabile)
          <Animated.View entering={FadeIn.duration(Motion.contentFade)}>
            {sections.map((section) => (
              <View key={section.key}>
                <View style={styles.sectionHeader}>
                  <SectionHeader
                    title={t(`sections.${section.key}`)}
                    count={section.data.length}
                    collapsed={collapsed[section.key]}
                    onToggle={() => toggleSection(section.key)}
                  />
                </View>
                <Collapsible collapsed={collapsed[section.key]}>
                  {section.data.map((item) => (
                    <View key={`${item.kind}-${item.id}`} style={styles.cardWrap}>
                      {renderCard(item)}
                    </View>
                  ))}
                </Collapsible>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Contenitore ad altezza definita come nel profilo: sotto TabSlot un `flex: 1` non la fissa, e
  // senza un'altezza nota la ScrollView cresce col contenuto invece di scorrere
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  list: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
  },
  filters: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  sectionHeader: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + Spacing.half,
  },
  cardWrap: {
    paddingBottom: Spacing.two,
  },
  skeletons: {
    gap: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
