import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { GroupMemberRow } from '@/components/group/group-member-row';
import { GroupListCard } from '@/components/group/group-list-card';
import { useGroupDetail, type GroupMember } from '@/utils/useGroupDetail';
import { useDeleteGroup } from '@/utils/useGroups';
import { useMyFriends, type Friend } from '@/utils/useFriends';
import { useProfile } from '@/utils/useProfile';

const SKELETON_COUNT = 3;

export default function GroupDetailScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useProfile();
  const { group, loading, error, leaveGroup, leaving, removeGroupMember, inviteToGroup, inviting } =
    useGroupDetail(id);
  const { deleteGroup, deleting } = useDeleteGroup();
  const { friends } = useMyFriends();

  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const myUserId = profile?.id;
  const isOwner = group?.ownerId === myUserId;
  const myMembership = group?.members.find((m) => m.userId === myUserId);
  const canManage = myMembership?.role === 'OWNER' || myMembership?.role === 'ADMIN';

  // amici non ancora nel gruppo
  const memberIds = new Set(group?.members.map((m) => m.userId) ?? []);
  const invitableFriends = friends.filter((f: Friend) => !memberIds.has(f.id));

  const handleLeaveConfirmed = async () => {
    setConfirmLeave(false);
    try {
      await leaveGroup();
      router.back();
    } catch (_) {}
  };

  const handleDeleteConfirmed = async () => {
    setConfirmDelete(false);
    try {
      await deleteGroup(id);
      router.back();
    } catch (_) {}
  };

  const handleRemoveConfirmed = async () => {
    if (!memberToRemove) return;
    const userId = memberToRemove.userId;
    setMemberToRemove(null);
    try {
      await removeGroupMember(userId);
    } catch (_) {}
  };

  const roleLabel = (role: string) => t(`member.roles.${role}`, { defaultValue: role });
  const memberListCountLabel = (count: number) =>
    t('groupList.memberListCount_other', { count });

  const showSkeleton = loading && !group;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.back, { color: colors.textSecondary }]}>←</Text>
        </Pressable>
      </View>

      {showSkeleton ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !group ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('detail.error')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{group.name}</Text>
          {group.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {group.description}
            </Text>
          ) : null}

          {/* Liste del gruppo */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.lists')}</Text>
          {group.groupLists.length === 0 ? (
            <Text style={[styles.emptySection, { color: colors.textSecondary }]}>
              {t('groupList.empty')}
            </Text>
          ) : (
            group.groupLists.map((gl) => (
              <GroupListCard
                key={gl.id}
                name={gl.name}
                icon={gl.icon}
                color={gl.color}
                description={gl.description}
                memberListCount={gl.memberListCount}
                memberListCountLabel={memberListCountLabel(gl.memberListCount)}
                colorScheme={colorScheme}
                onPress={() =>
                  router.push({
                    pathname: '/group-list/[groupListId]',
                    params: { groupListId: gl.id, listName: gl.name },
                  })
                }
              />
            ))
          )}

          {/* Membri */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('detail.members')}</Text>
          {group.members.map((member) => (
            <GroupMemberRow
              key={member.id}
              username={member.user.username}
              roleLabel={roleLabel(member.role)}
              removeLabel={t('member.remove')}
              colorScheme={colorScheme}
              canRemove={canManage && member.userId !== myUserId && member.role !== 'OWNER'}
              onRemove={() => setMemberToRemove(member)}
            />
          ))}

          {/* Invita amici */}
          {canManage && (
            <>
              <Pressable
                onPress={() => setShowInvite((v) => !v)}
                style={[styles.secondaryBtn, { backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
                  {t('detail.invite')}
                </Text>
              </Pressable>
              {showInvite && (
                <View style={styles.inviteList}>
                  {invitableFriends.length === 0 ? (
                    <Text style={[styles.emptySection, { color: colors.textSecondary }]}>
                      {t('detail.noFriends')}
                    </Text>
                  ) : (
                    invitableFriends.map((friend: Friend) => (
                      <Pressable
                        key={friend.id}
                        onPress={() => inviteToGroup(friend.id)}
                        disabled={inviting}
                        style={[styles.friendRow, { backgroundColor: colors.backgroundElement }]}>
                        <Text style={[styles.friendName, { color: colors.text }]}>
                          {friend.username}
                        </Text>
                        <Text style={[styles.inviteAction, { color: colors.textSecondary }]}>
                          {t('detail.invite')}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </>
          )}

          {/* Azioni pericolose */}
          <View style={styles.dangerZone}>
            {!isOwner && (
              <Pressable
                onPress={() => setConfirmLeave(true)}
                style={[styles.dangerBtn, { backgroundColor: colors.backgroundElement }]}>
                <Text style={styles.dangerText}>{t('detail.leave')}</Text>
              </Pressable>
            )}
            {isOwner && (
              <Pressable
                onPress={() => setConfirmDelete(true)}
                disabled={deleting}
                style={[styles.dangerBtn, { backgroundColor: colors.backgroundElement }]}>
                <Text style={styles.dangerText}>{t('detail.delete')}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}

      <ConfirmSheet
        visible={confirmLeave}
        title={t('detail.leaveConfirmTitle')}
        message={t('detail.leaveConfirmMessage')}
        confirmLabel={t('detail.leave')}
        cancelLabel={t('createModal.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleLeaveConfirmed}
        onCancel={() => setConfirmLeave(false)}
      />
      <ConfirmSheet
        visible={confirmDelete}
        title={t('detail.deleteConfirmTitle')}
        message={t('detail.deleteConfirmMessage')}
        confirmLabel={t('detail.delete')}
        cancelLabel={t('createModal.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmSheet
        visible={memberToRemove != null}
        title={t('member.removeConfirmTitle')}
        message={t('member.removeConfirmMessage')}
        confirmLabel={t('member.remove')}
        cancelLabel={t('createModal.cancel')}
        colorScheme={colorScheme}
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setMemberToRemove(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  back: { fontSize: 24 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 48,
    gap: Spacing.two + Spacing.one,
  },
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
    paddingBottom: Spacing.one,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka_700Bold',
    paddingTop: Spacing.three,
  },
  emptySection: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
  secondaryBtn: {
    borderRadius: 14,
    padding: Spacing.three,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  inviteList: { gap: Spacing.two },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: Spacing.three,
  },
  friendName: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  inviteAction: {
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
  },
  dangerZone: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  dangerBtn: {
    borderRadius: 14,
    padding: Spacing.three,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: '#E53E3E',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka_700Bold',
    textAlign: 'center',
  },
});
