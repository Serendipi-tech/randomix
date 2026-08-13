import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutGrid, List } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useNavbarClearance } from '@/utils/useNavbarClearance';
import { DEFAULT_LIST_ICON_KEY, resolveListIcon, type ListIconKey } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { PageHeader } from '@/components/molecules/PageHeader';
import { CardShell } from '@/components/cards/CardShell';
import { ColorPickerRow } from '@/components/atoms/color-picker-row';
import { IconPickerRow } from '@/components/atoms/icon-picker-row';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/cards/ListCard';
import { FriendCard } from '@/components/cards/FriendCard';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { useGroupDetail, type GroupMember } from '@/utils/useGroupDetail';
import { useDeleteGroup } from '@/utils/useGroups';
import { useMyFriends, type Friend } from '@/utils/useFriends';
import { useProfile } from '@/utils/useProfile';

const SKELETON_COUNT = 3;
const LIST_COLORS = [
  Colors.light.accent,
  Colors.light.secondary,
  Colors.light.warning,
  Colors.light.success,
  Colors.light.primary,
];

export default function GroupDetailScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const listBottomPadding = useNavbarClearance();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useProfile();
  const {
    group,
    loading,
    error,
    leaveGroup,
    leaving,
    removeGroupMember,
    inviteToGroup,
    revokeInvite,
    createGroupList,
    creatingList,
  } = useGroupDetail(id);
  const { deleteGroup, deleting } = useDeleteGroup();
  const { friends } = useMyFriends();

  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [listName, setListName] = useState('');
  const [listIcon, setListIcon] = useState<ListIconKey>(DEFAULT_LIST_ICON_KEY);
  const [listColor, setListColor] = useState<string>(LIST_COLORS[0]);
  const [listError, setListError] = useState<string | null>(null);

  const myUserId = profile?.id;
  const isOwner = group?.ownerId === myUserId;
  const myMembership = group?.members.find((m) => m.userId === myUserId);
  const canManage = myMembership?.role === 'OWNER' || myMembership?.role === 'ADMIN';

  // amici non ancora nel gruppo
  const memberIds = new Set(group?.members.map((m) => m.userId) ?? []);
  const invitableFriends = friends.filter((f: Friend) => !memberIds.has(f.id));

  // righe della sezione invito: amici invitabili (con stato pending) + inviti pendenti verso ex-amici
  const pendingIds = new Set(group?.pendingInvites.map((p) => p.userId) ?? []);
  const friendIds = new Set(friends.map((f: Friend) => f.id));
  const inviteRows = [
    ...invitableFriends.map((f: Friend) => ({
      userId: f.id,
      username: f.username,
      pending: pendingIds.has(f.id),
    })),
    ...(group?.pendingInvites ?? [])
      .filter((p) => !friendIds.has(p.userId))
      .map((p) => ({ userId: p.userId, username: p.username, pending: true })),
  ];

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

  const handleInvite = async (userId: string) => {
    setProcessingId(userId);
    try {
      await inviteToGroup(userId);
    } catch (_) {
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevoke = async (userId: string) => {
    setProcessingId(userId);
    try {
      await revokeInvite(userId);
    } catch (_) {
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateList = async () => {
    setListError(null);
    if (!listName.trim()) {
      setListError(t('detail.newList.missing'));
      return;
    }
    try {
      await createGroupList({ name: listName.trim(), icon: listIcon, color: listColor });
      setListName('');
      setListIcon(DEFAULT_LIST_ICON_KEY);
      setListColor(LIST_COLORS[0]);
      setShowCreateList(false);
    } catch (e) {
      setListError((e as Error).message);
    }
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

  const showSkeleton = loading && !group;

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={LayoutGrid} title={group?.name ?? ''} onBack={() => router.back()} />

      {showSkeleton ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : !group ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.textColor }]}>{t('detail.error')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: listBottomPadding }]} showsVerticalScrollIndicator={false}>
          {group.description ? (
            <Text style={[styles.description, { color: colors.textColor }]}>
              {group.description}
            </Text>
          ) : null}

          {/* Liste del gruppo */}
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>{t('detail.lists')}</Text>
          {group.groupLists.length === 0 ? (
            <Text style={[styles.emptySection, { color: colors.textColor }]}>
              {t('groupList.empty')}
            </Text>
          ) : (
            group.groupLists.map((gl) => (
              <ListCard
                key={gl.id}
                title={gl.name}
                category={gl.description ?? undefined}
                icon={resolveListIcon(gl.icon)}
                color={gl.color}
                itemsCount={gl.memberListCount}
                onPress={() =>
                  router.push({
                    pathname: '/group-list/[groupListId]',
                    params: { groupListId: gl.id, listName: gl.name },
                  })
                }
              />
            ))
          )}

          {/* Crea lista di gruppo (solo OWNER/ADMIN) */}
          {canManage && (
            <>
              {showCreateList ? (
                <View style={[styles.createCard, { backgroundColor: colors.foreground }]}>
                  <Input
                    placeholder={t('detail.newList.namePlaceholder')}
                    value={listName}
                    onChangeText={setListName}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.pickerLabel, { color: colors.textColor }]}>
                    {t('detail.newList.color')}
                  </Text>
                  <ColorPickerRow
                    colors={LIST_COLORS}
                    selected={listColor}
                    onSelect={setListColor}
                    colorScheme={colorScheme}
                  />
                  <Text style={[styles.pickerLabel, { color: colors.textColor }]}>
                    {t('detail.newList.icon')}
                  </Text>
                  <IconPickerRow
                    selected={listIcon}
                    onSelect={setListIcon}
                    accentColor={listColor}
                    colorScheme={colorScheme}
                  />
                  {listError && <Text style={styles.listError}>{listError}</Text>}
                  <Button
                    label={t('detail.newList.submit')}
                    onPress={handleCreateList}
                    loading={creatingList}
                  />
                  <Button
                    variant="secondary"
                    label={t('detail.newList.cancel')}
                    onPress={() => {
                      setShowCreateList(false);
                      setListError(null);
                    }}
                    disabled={creatingList}
                  />
                </View>
              ) : (
                <Button
                  variant="secondary"
                  label={t('detail.createList')}
                  onPress={() => setShowCreateList(true)}
                />
              )}
            </>
          )}

          {/* Membri */}
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>{t('detail.members')}</Text>
          {group.members.map((member) => {
            const canRemove = canManage && member.userId !== myUserId && member.role !== 'OWNER';
            return (
              <FriendCard
                key={member.id}
                username={member.user.username}
                imageUri={member.user.avatarUrl ?? undefined}
                subtitle={roleLabel(member.role)}
                onRemove={canRemove ? () => setMemberToRemove(member) : undefined}
              />
            );
          })}

          {/* Invita amici */}
          {canManage && (
            <>
              <Button
                variant="secondary"
                label={t('detail.invite')}
                onPress={() => setShowInvite((v) => !v)}
              />
              {showInvite && (
                <View style={styles.inviteList}>
                  {inviteRows.length === 0 ? (
                    <Text style={[styles.emptySection, { color: colors.textColor }]}>
                      {t('detail.noFriends')}
                    </Text>
                  ) : (
                    inviteRows.map((row) => {
                      const isProcessing = processingId === row.userId;
                      return (
                        <CardShell
                          key={row.userId}
                          onPress={() => {
                            if (isProcessing) return;
                            row.pending ? handleRevoke(row.userId) : handleInvite(row.userId);
                          }}
                        >
                          <View style={styles.inviteRow}>
                            <View style={styles.friendInfo}>
                              <Text style={[styles.friendName, { color: colors.textColor }]} numberOfLines={1}>
                                {row.username}
                              </Text>
                              {row.pending && (
                                <Text style={[styles.invitedBadge, { color: colors.textColor }]}>
                                  {t('detail.invited')}
                                </Text>
                              )}
                            </View>
                            <Text
                              style={[
                                styles.inviteAction,
                                { color: row.pending ? colors.error : colors.primary },
                              ]}
                            >
                              {isProcessing
                                ? '…'
                                : row.pending
                                  ? t('detail.revoke')
                                  : t('detail.invite')}
                            </Text>
                          </View>
                        </CardShell>
                      );
                    })
                  )}
                </View>
              )}
            </>
          )}

          {/* Azioni pericolose */}
          <View style={styles.dangerZone}>
            {!isOwner && (
              <Button
                variant="destructive"
                label={t('detail.leave')}
                onPress={() => setConfirmLeave(true)}
                loading={leaving}
              />
            )}
            {isOwner && (
              <Button
                variant="destructive"
                label={t('detail.delete')}
                onPress={() => setConfirmDelete(true)}
                loading={deleting}
              />
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
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  skeletonContainer: {
    padding: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingTop: Spacing.three,
  },
  emptySection: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
  createCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  listError: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
  inviteList: { gap: Spacing.two },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  friendName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  invitedBadge: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  inviteAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  dangerZone: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
