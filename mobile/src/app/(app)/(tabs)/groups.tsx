import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { GroupCard } from '@/components/group/group-card';
import { GroupInviteRow } from '@/components/group/group-invite-row';
import { useMyGroups, useCreateGroup, type GroupSummary } from '@/utils/useGroups';
import { useGroupInvites } from '@/utils/useGroupInvites';

const SKELETON_COUNT = 3;

export default function GroupsScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { groups, loading: loadingGroups, error: groupsError, refetch } = useMyGroups();
  const { invites, acceptInvite, rejectInvite } = useGroupInvites();
  const { createGroup, creating } = useCreateGroup();

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [answeringId, setAnsweringId] = useState<string | null>(null);

  const showSkeleton = loadingGroups && groups.length === 0;

  const handleCreate = async () => {
    setCreateError(null);
    if (!groupName.trim()) {
      setCreateError(t('createModal.nameRequired'));
      return;
    }
    try {
      await createGroup(groupName.trim(), groupDescription.trim() || undefined);
      setGroupName('');
      setGroupDescription('');
      setShowCreate(false);
    } catch (e) {
      setCreateError((e as Error).message);
    }
  };

  const handleAnswer = async (inviteId: string, answer: (id: string) => Promise<unknown>) => {
    setAnsweringId(inviteId);
    try {
      await answer(inviteId);
    } catch (_) {
    } finally {
      setAnsweringId(null);
    }
  };

  const roleLabel = (role: string) =>
    t(`member.roles.${role}`, { defaultValue: role });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GradientBackgroundView colorScheme={colorScheme} />
      <FlatList
        data={showSkeleton ? [] : groups}
        keyExtractor={(g: GroupSummary) => g.id}
        contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
        onRefresh={refetch}
        refreshing={loadingGroups && groups.length > 0}
        renderItem={({ item }) => (
          <GroupCard
            name={item.name}
            description={item.description}
            memberCount={item.memberCount}
            myRole={item.myRole}
            membersLabel={item.memberCount === 1 ? 'member' : 'members'}
            roleLabel={roleLabel(item.myRole)}
            colorScheme={colorScheme}
            onPress={() =>
              router.push({ pathname: '/group/[id]', params: { id: item.id } })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>

            {showCreate && (
              <View style={[styles.createCard, { backgroundColor: colors.backgroundElement }]}>
                <Input
                  colorScheme={colorScheme}
                  placeholder={t('createModal.namePlaceholder')}
                  value={groupName}
                  onChangeText={setGroupName}
                  autoCapitalize="words"
                />
                <Input
                  colorScheme={colorScheme}
                  placeholder={t('createModal.descriptionPlaceholder')}
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                />
                {createError && (
                  <Text style={styles.errorText}>{createError}</Text>
                )}
                <Button
                  colorScheme={colorScheme}
                  label={t('createModal.submit')}
                  onPress={handleCreate}
                  loading={creating}
                />
                <Button
                  colorScheme={colorScheme}
                  variant="secondary"
                  label={t('createModal.cancel')}
                  onPress={() => {
                    setShowCreate(false);
                    setCreateError(null);
                  }}
                  disabled={creating}
                />
              </View>
            )}

            {!showCreate && (
              <Button
                colorScheme={colorScheme}
                label={t('create')}
                onPress={() => setShowCreate(true)}
              />
            )}

            {invites.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t('invites.title')}
                </Text>
                {invites.map((invite) => (
                  <GroupInviteRow
                    key={invite.id}
                    groupName={invite.groupName}
                    senderUsername={invite.sender.username}
                    fromLabel={t('invites.from')}
                    acceptLabel={t('invites.accept')}
                    rejectLabel={t('invites.reject')}
                    colorScheme={colorScheme}
                    disabled={answeringId === invite.id}
                    onAccept={() => handleAnswer(invite.id, acceptInvite)}
                    onReject={() => handleAnswer(invite.id, rejectInvite)}
                  />
                ))}
              </>
            )}

            {showSkeleton &&
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ListCardSkeleton key={i} colorScheme={colorScheme} />
              ))}
          </View>
        }
        ListEmptyComponent={
          showSkeleton ? null : (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {groupsError ? t('error') : t('empty.title')}
              </Text>
              {!groupsError && (
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {t('empty.subtitle')}
                </Text>
              )}
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    gap: Spacing.two + Spacing.one,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka_700Bold',
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka_700Bold',
    paddingTop: Spacing.three,
  },
  createCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka_700Bold',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
  },
});
